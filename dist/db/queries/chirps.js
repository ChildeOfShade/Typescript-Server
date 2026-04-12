// Correct implementation for src/db/queries/chirps.ts
import { db } from "../index.js";
import { chirps } from "../schema.js";
import { asc } from "drizzle-orm";
export async function createChirp(data) {
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
