import { eq } from "drizzle-orm";
import { monitors } from "../schema/monitors.js";
import type { createDatabase } from "../client.js";

type Database = ReturnType<typeof createDatabase>["db"];

export async function createMonitor(
  db: Database,
  input: {
    userId: string;
    name: string;
    url: string;
    method: string;
    intervalSeconds: number;
    timeoutMs: number;
    expectedStatusCode: number;
  },
) {
  const [monitor] = await db
    .insert(monitors)
    .values({
      userId: input.userId,
      name: input.name,
      url: input.url,
      method: input.method,
      intervalSeconds: input.intervalSeconds,
      timeoutMs: input.timeoutMs,
      expectedStatusCode: input.expectedStatusCode,
    })
    .returning();

  return monitor;
}

export async function listMonitors(db: Database, userId: string) {
  return db.select().from(monitors).where(eq(monitors.userId, userId));
}

export async function getMonitor(db: Database, id: string) {
  const [monitor] = await db
    .select()
    .from(monitors)
    .where(eq(monitors.id, id))
    .limit(1);

  return monitor;
}

export async function deleteMonitor(db: Database, id: string) {
  const [monitor] = await db
    .delete(monitors)
    .where(eq(monitors.id, id))
    .returning();

  return monitor;
}

export async function updateMonitor(
  db: Database,
  id: string,
  input: {
    name?: string;
    url?: string;
    method?: string;
    intervalSeconds?: number;
    timeoutMs?: number;
    expectedStatusCode?: number;
    isActive?: boolean;
  },
) {
  const [monitor] = await db
    .update(monitors)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(monitors.id, id))
    .returning();

  return monitor;
}
