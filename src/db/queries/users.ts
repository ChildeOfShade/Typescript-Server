import { db } from "../index.js";
import { NewUser, users } from "../schema.js";

export async function createUser(user: NewUser) {
  // result will be the single user object inserted
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
    
  return result;
}