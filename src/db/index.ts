import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";
import { config } from "../config.js";

// Create the connection using the URL from our config
const conn = postgres(config.dbURL);

// Export the db object to use in queries
export const db = drizzle(conn, { schema });