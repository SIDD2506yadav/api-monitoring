import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { monitors } from "./monitors.js";

export const monitorResults = pgTable(
  "monitor_results",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    monitorId: uuid("monitor_id")
      .notNull()
      .references(() => monitors.id, { onDelete: "cascade" }),
    success: boolean("success").notNull(),
    statusCode: integer("status_code"),
    latencyMs: integer("latency_ms"),
    errorMessage: text("error_message"),
    checkedAt: timestamp("checked_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    index("monitor_results_monitor_checked_at_idx").on(
      table.monitorId,
      table.checkedAt,
    ),
  ],
);

export const monitorResultsRelations = relations(
  monitorResults,
  ({ one }) => ({
    monitor: one(monitors, {
      fields: [monitorResults.monitorId],
      references: [monitors.id],
    }),
  }),
);
