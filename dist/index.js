import express from "express";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 8080;
// The current working directory (process.cwd()) is the project root 
// where you run 'npm run dev'. Using path.join(process.cwd(), 'app') 
// is much safer and more reliable here.
const appPath = path.join(process.cwd(), "app");
app.get("/healthz", (req, res) => {
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.status(200).send("OK");
});
app.use("/app", express.static(appPath));
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
