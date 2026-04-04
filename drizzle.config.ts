// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  // Point this to your actual schema file!
  schema: "./src/db/schema.ts", 
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DB_URL!,
  },
});