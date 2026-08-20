import { monitors } from "@api-monitoring/database";
import { db } from "../database";
import type { CreateMonitorInput } from "../schemas/monitor";

export async function createMonitor(input: CreateMonitorInput) {
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
