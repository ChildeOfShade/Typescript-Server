import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";
import { config } from "../config.js";

// 1. Create the postgres connection using the nested config path
const conn = postgres(config.db.url);

// 2. Export the drizzle 'db' object with the schema attached
// This is what you'll import in your queries (e.g., src/db/queries/users.ts)
export const db = drizzle(conn, { schema });