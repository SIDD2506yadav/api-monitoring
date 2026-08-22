import { createMonitorResult as createMonitorResultRecord } from "@api-monitoring/database";
import { db } from "../database";

export function createMonitorResult(input: {
  monitorId: string;
  success: boolean;
  statusCode?: number;
  latencyMs?: number;
  errorMessage?: string;
  checkedAt: Date;
}) {
  return createMonitorResultRecord(db, input);
}
