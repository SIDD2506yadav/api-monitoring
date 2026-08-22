import type {
  CreateMonitorInput,
  ListMonitorsInput,
  UpdateMonitorInput,
} from "../schemas/monitor";
import {
  createMonitor,
  listMonitors,
  deleteMonitor,
  updateMonitor,
} from "../repositories/monitor.repository";

export async function createMonitorService(input: CreateMonitorInput) {
  return createMonitor(input);
}

export async function listMonitorsService(input: ListMonitorsInput) {
  return listMonitors(input);
}

export async function deleteMonitorService(id: string) {
  return deleteMonitor(id);
}

export function updateMonitorService(id: string, input: UpdateMonitorInput) {
  return updateMonitor(id, input);
}
