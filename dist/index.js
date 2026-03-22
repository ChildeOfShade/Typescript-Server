import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "./config.js";
// Setup for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appPath = path.join(process.cwd(), "app");
const app = express();
const PORT = 8080;
// 1. Logging Middleware (for non-OK status codes)
const middlewareLogResponses = (req, res, next) => {
    res.on("finish", () => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`);
        }
    });
    next();
};
// 2. Metrics Middleware (increments hit count ONLY for /app requests)
const middlewareMetricsInc = (req, res, next) => {
    if (req.url.startsWith("/app")) {
        config.fileserverHits += 1;
    }
    next();
};
// 3. Handlers
const handlerHealthz = (req, res) => {
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.status(200).send("OK");
};
const handlerMetrics = (req, res) => {
    // Change plain to html
    res.set("Content-Type", "text/html; charset=utf-8");
    // Use the template and inject the hit count
    res.status(200).send(`
<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.fileserverHits} times!</p>
  </body>
</html>
  `);
};
const handlerReset = (req, res) => {
    config.fileserverHits = 0;
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.status(200).send("OK");
};
const handlerValidateChirp = (req, res) => {
    const { body } = req.body;
    // 1. Handle missing body or unexpected errors
    if (typeof body !== 'string') {
        return res.status(400).json({ error: "Something went wrong" });
    }
    // 2. Check the "Silly Rule" (140 character limit)
    if (body.length > 140) {
        return res.status(400).json({ error: "Chirp is too long" });
    }
    // 3. If valid, send 200 OK
    return res.status(200).json({ valid: true });
};
// 4. Register Middleware and Routes
// Order matters: Logging first, then metric tracking, then routes
app.use(middlewareLogResponses);
app.use(middlewareMetricsInc);
app.use(express.json()); // This middleware is essential for reading POST bodies
// Change this line from .get to .post
app.post("/admin/reset", handlerReset);
app.post("/api/validate_chirp", handlerValidateChirp);
// Keep the others as they were
app.get("/admin/metrics", handlerMetrics);
app.get("/api/healthz", handlerHealthz);
app.get("/", (req, res) => {
    res.redirect("/app/");
});
// Static files served at /app
app.use("/app", express.static(appPath));
// 5. Start Server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
