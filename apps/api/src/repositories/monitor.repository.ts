import {
  createMonitor as createMonitorRecord,
  listMonitors as listMonitorRecords,
} from "@api-monitoring/database";
import { db } from "../database";
import type { CreateMonitorInput, ListMonitorsInput } from "../schemas/monitor";

export function createMonitor(input: CreateMonitorInput) {
  return createMonitorRecord(db, input);
}

export function listMonitors({ userId }: ListMonitorsInput) {
  return listMonitorRecords(db, userId);
}
