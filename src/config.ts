import { MigrationConfig } from "drizzle-orm/migrator";

process.loadEnvFile();

function envOrThrow(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value;
}

export interface DBConfig {
  url: string;
  migrationConfig: MigrationConfig;
}

export interface APIConfig {
  fileserverHits: number;
  platform: string; // Add this
}

// Combine both configurations into a single exported object
export const config = {
  api: {
    fileserverHits: 0,
    platform: process.env.PLATFORM || "dev", // Default to dev if not set
  } as APIConfig,
  db: {
    url: envOrThrow("DB_URL"),
    migrationConfig: {
      migrationsFolder: "./drizzle", 
    },
  } as DBConfig,
};