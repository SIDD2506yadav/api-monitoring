import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const monitors = pgTable(
  "monitors",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    url: text("url").notNull(),
    method: varchar("method", { length: 10 }).notNull(),
    intervalSeconds: integer("interval_seconds").notNull(),
    timeoutMs: integer("timeout_ms").notNull(),
    expectedStatusCode: integer("expected_status_code").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("monitors_user_id_idx").on(table.userId)],
);

export const monitorsRelations = relations(monitors, ({ one }) => ({
  user: one(users, {
    fields: [monitors.userId],
    references: [users.id],
  }),
}));

export type Monitor = typeof monitors.$inferSelect;
