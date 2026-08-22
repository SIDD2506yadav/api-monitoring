import { monitorResults } from "../schema/monitor-results.js";
import type { createDatabase } from "../client.js";

type Database = ReturnType<typeof createDatabase>["db"];

export async function createMonitorResult(
  db: Database,
  input: {
    monitorId: string;
    success: boolean;
    statusCode?: number;
    latencyMs?: number;
    errorMessage?: string;
    checkedAt: Date;
  },
) {
  const [result] = await db
    .insert(monitorResults)
    .values({
      monitorId: input.monitorId,
      success: input.success,
      statusCode: input.statusCode,
      latencyMs: input.latencyMs,
      errorMessage: input.errorMessage,
      checkedAt: input.checkedAt,
    })
    .returning();

  return result;
}
