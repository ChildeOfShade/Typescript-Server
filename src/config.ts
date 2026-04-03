import { Request, Response, NextFunction } from "express";

// 1. Load the environment variables first!
process.loadEnvFile();

// 2. Helper to crash if the key is missing
function envOrThrow(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export interface APIConfig {
  fileserverHits: number;
  dbURL: string; // Add this field
}

export const config: APIConfig = {
  fileserverHits: 0,
  dbURL: envOrThrow("DB_URL"), // Load the variable here
};