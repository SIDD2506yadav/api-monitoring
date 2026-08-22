import {
  createMonitor as createMonitorRecord,
  listMonitors as listMonitorRecords,
  deleteMonitor as deleteMonitorRecord,
  updateMonitor as updateMonitorRecord,
} from "@api-monitoring/database";
import { db } from "../database";
import type {
  CreateMonitorInput,
  ListMonitorsInput,
  UpdateMonitorInput,
} from "../schemas/monitor";

export function createMonitor(input: CreateMonitorInput) {
  return createMonitorRecord(db, input);
}

export function listMonitors({ userId }: ListMonitorsInput) {
  return listMonitorRecords(db, userId);
}

export function deleteMonitor(id: string) {
  return deleteMonitorRecord(db, id);
}

export function updateMonitor(id: string, input: UpdateMonitorInput) {
  return updateMonitorRecord(db, id, input);
}
