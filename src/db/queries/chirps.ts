// Correct implementation for src/db/queries/chirps.ts
import { db } from "../index.js"; 
import { chirps, type NewChirp } from "../schema.js";
import { asc } from "drizzle-orm";

export async function createChirp(data: NewChirp) {
  const [result] = await db
    .insert(chirps)
    .values(data) // data should contain { body: "...", userId: "..." }
    .returning();
  return result;
}

export async function getChirps() {
  return await db
    .select()
    .from(chirps)
    .orderBy(asc(chirps.createdAt));
}