import { pgTable, uuid, text, timestamp, varchar } from "drizzle-orm/pg-core";
// --- USERS TABLE ---
export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    email: varchar("email", { length: 256 }).notNull().unique(),
    hashedPassword: varchar("hashed_password").notNull().default("unset"),
});
// --- CHIRPS TABLE ---
export const chirps = pgTable("chirps", {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    body: text("body").notNull(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
});
