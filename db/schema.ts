import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const rules = pgTable("rules", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    rule_string: text("rule_string").notNull(),
    created_at: timestamp("created_at")
        .default(sql`NOW()`)
        .notNull(),
});

export type Rules = typeof rules.$inferSelect;
