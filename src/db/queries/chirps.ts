// Correct implementation for src/db/queries/chirps.ts
import { db } from "../index.js"; 
import { chirps, type NewChirp } from "../schema.js";
import { asc } from "drizzle-orm";
import { eq } from "drizzle-orm";

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

export async function getChirpById(id: string) {
  const [chirp] = await db
    .select()
    .from(chirps)
    .where(eq(chirps.id, id));
  
  return chirp; // This will be undefined if no chirp matches the ID
}