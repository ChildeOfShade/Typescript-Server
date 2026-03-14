import express, { Request, Response, NextFunction } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "./config.js"; // Import the config

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appPath = path.join(process.cwd(), "app");

const app = express();
const PORT = 8080;

// Metric incrementer middleware
const middlewareMetricsInc = (req: Request, res: Response, next: NextFunction) => {
  config.fileserverHits += 1;
  next();
};

// Handler for /metrics
const handlerMetrics = (req: Request, res: Response) => {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.status(200).send(`Hits: ${config.fileserverHits}`);
};

// Handler for /reset
const handlerReset = (req: Request, res: Response) => {
  config.fileserverHits = 0;
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.status(200).send("OK");
};

// Apply routes
// 1. Log responses middleware (from previous step)
// 2. Metrics endpoint
app.get("/metrics", handlerMetrics);
app.get("/reset", handlerReset);

// 3. Static files with the new Metric Incrementer middleware
app.use("/app", middlewareMetricsInc, express.static(appPath));

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});