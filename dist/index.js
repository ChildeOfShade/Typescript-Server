import express from "express";
import path from "path";
import { handlerChirpsValidate } from "./api/chirps.js";
import { fileURLToPath } from "url";
import { config } from "./config.js";
import { AppError } from "./errors.js";
// Setup for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appPath = path.join(process.cwd(), "app");
const app = express();
const PORT = 8080;
// --- 1. MIDDLEWARE DEFINITIONS ---
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
        config.fileserverHits += 1;
    }
    next();
};
// --- 2. GLOBAL MIDDLEWARE MOUNTING ---
// Order is critical here: Log -> Metrics -> JSON Parser
app.use(middlewareLogResponses);
app.use(middlewareMetricsInc);
app.use(express.json());
// --- 3. ROUTES ---
app.post("/admin/reset", (req, res) => {
    config.fileserverHits = 0;
    res.status(200).send("OK");
});
app.get("/admin/metrics", (req, res) => {
    res.set("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(`
<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.fileserverHits} times!</p>
  </body>
</html>
  `);
});
// Main assignment route
app.post("/api/validate_chirp", handlerChirpsValidate);
app.get("/api/healthz", (req, res) => {
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.status(200).send("OK");
});
app.get("/", (req, res) => {
    res.redirect("/app/");
});
// Static files
app.use("/app", express.static(appPath));
// --- 4. ERROR HANDLING MIDDLEWARE ---
// Combine both into one single block. 
// This must be the VERY LAST app.use before app.listen.
app.use((err, req, res, next) => {
    // 1. Log the error for your own debugging
    console.error(err);
    // 2. Check if it's one of our custom errors
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            error: err.message
        });
    }
    // 3. If it's not a custom error, send the generic 500
    res.status(500).json({
        error: "Something went wrong on our end"
    });
});
// --- 5. START SERVER ---
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
// REMOVE the extra app.use that was sitting down here!
