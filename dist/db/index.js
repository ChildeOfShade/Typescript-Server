import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";
import { config } from "../config.js";
// 1. Create the postgres connection using the DB URL from your config
// We use a separate connection for the 'db' instance than the 'migrationClient'
const conn = postgres(config.db.url);
// 2. Export the drizzle 'db' object with the schema attached
// This instance is what all your query files will use to talk to Postgres
export const db = drizzle(conn, { schema });
