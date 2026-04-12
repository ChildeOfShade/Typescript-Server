import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { type InferInsertModel } from "drizzle-orm"; // Add this

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const chirps = pgTable("chirps", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  body: text("body").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

// ADD THESE TWO LINES:
export type NewUser = InferInsertModel<typeof users>;
export type NewChirp = InferInsertModel<typeof chirps>;