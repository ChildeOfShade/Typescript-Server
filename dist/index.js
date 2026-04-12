import express from "express";
import path from "path";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { fileURLToPath } from "url";
import { config } from "./config.js";
import { AppError } from "./errors.js";
import { createUser, deleteAllUsers } from "./db/queries/users.js";
import { createChirp, getChirps } from "./db/queries/chirps.js";
// --- 1. DATABASE MIGRATIONS ---
const migrationClient = postgres(config.db.url, { max: 1 });
try {
    console.log("Running database migrations...");
    await migrate(drizzle(migrationClient), config.db.migrationConfig);
    console.log("Database migrations completed.");
}
catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
}
finally {
    await migrationClient.end();
}
// --- 2. SETUP & MIDDLEWARE ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appPath = path.join(process.cwd(), "app");
const app = express();
const PORT = 8080;
const middlewareLogResponses = (req, res, next) => {
    res.on("finish", () => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`);
        }
    });
    next();
};
const middlewareMetricsInc = (req, res, next) => {
    if (req.url.startsWith("/app")) {
        config.api.fileserverHits += 1;
    }
    next();
};
app.use(middlewareLogResponses);
app.use(middlewareMetricsInc);
app.use(express.json());
// --- 3. ROUTES ---
// Admin: Reset
app.post("/admin/reset", async (req, res, next) => {
    try {
        if (config.api.platform !== "dev") {
            return res.status(403).json({ error: "Forbidden" });
        }
        await deleteAllUsers();
        config.api.fileserverHits = 0;
        res.status(200).send("OK");
    }
    catch (err) {
        next(err);
    }
});
// Admin: Metrics
app.get("/admin/metrics", (req, res) => {
    res.set("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(`
    <html>
      <body>
        <h1>Welcome, Chirpy Admin</h1>
        <p>Chirpy has been visited ${config.api.fileserverHits} times!</p>
      </body>
    </html>
  `);
});
// API: Create User
app.post("/api/users", async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email)
            return res.status(400).json({ error: "Email is required" });
        const user = await createUser({ email });
        if (!user)
            return res.status(409).json({ error: "User already exists" });
        res.status(201).json({
            id: user.id,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    }
    catch (err) {
        next(err);
    }
});
// API: Create Chirp
app.post("/api/chirps", async (req, res, next) => {
    try {
        const { body, userId } = req.body;
        if (!body || typeof body !== "string") {
            return res.status(400).json({ error: "Body is required" });
        }
        if (body.length > 140) {
            return res.status(400).json({ error: "Chirp is too long" });
        }
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }
        const chirp = await createChirp({ body, userId });
        res.status(201).json({
            id: chirp.id,
            createdAt: chirp.createdAt,
            updatedAt: chirp.updatedAt,
            body: chirp.body,
            userId: chirp.userId,
        });
    }
    catch (err) {
        next(err);
    }
});
// API: Health Check
app.get("/api/healthz", (req, res) => {
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.status(200).send("OK");
});
// API: Get All Chirps
app.get("/api/chirps", async (req, res, next) => {
    try {
        const allChirps = await getChirps();
        // Drizzle returns the objects. We just need to ensure 
        // the field names match the requirements (id, createdAt, etc.)
        res.status(200).json(allChirps);
    }
    catch (err) {
        next(err);
    }
});
// Static Assets
app.get("/", (req, res) => res.redirect("/app/"));
app.use("/app", express.static(appPath));
// --- 4. ERROR HANDLING ---
app.use((err, req, res, next) => {
    console.error(err);
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ error: err.message });
    }
    res.status(500).json({ error: "Something went wrong on our end" });
});
// --- 5. START SERVER ---
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
