import express, { Request, Response, NextFunction } from "express";
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
const middlewareLogResponses = (req: Request, res: Response, next: NextFunction) => {
  res.on("finish", () => {
    if (res.statusCode < 200 || res.statusCode >= 300) {
      console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`);
    }
  });
  next();
};

// 2. Metrics Middleware (increments hit count ONLY for /app requests)
const middlewareMetricsInc = (req: Request, res: Response, next: NextFunction) => {
  if (req.url.startsWith("/app")) {
    config.fileserverHits += 1;
  }
  next();
};

// 3. Handlers
const handlerHealthz = (req: Request, res: Response) => {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.status(200).send("OK");
};

const handlerMetrics = (req: Request, res: Response) => {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.status(200).send(`Hits: ${config.fileserverHits}`);
};

const handlerReset = (req: Request, res: Response) => {
  config.fileserverHits = 0;
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.status(200).send("OK");
};

// 4. Register Middleware and Routes
// Order matters: Logging first, then metric tracking, then routes
app.use(middlewareLogResponses);
app.use(middlewareMetricsInc);

app.get("/api/healthz", handlerHealthz);
app.get("/api/metrics", handlerMetrics);
app.get("/api/reset", handlerReset);
app.get("/", (req, res) => {
    res.redirect("/app/");
});

// Static files served at /app
app.use("/app", express.static(appPath));

// 5. Start Server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});