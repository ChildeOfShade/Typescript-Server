import { db } from "../index.js";
import { users } from "../schema.js";
export async function createUser(user) {
    // result will be the single user object inserted
    const [result] = await db
        .insert(users)
        .values(user)
        .onConflictDoNothing()
        .returning();
    return result;
}
