import type { CreateMonitorInput, ListMonitorsInput } from "../schemas/monitor";
import {
  createMonitor,
  listMonitors,
} from "../repositories/monitor.repository";

export async function createMonitorService(input: CreateMonitorInput) {
  return createMonitor(input);
}

export async function listMonitorsService(input: ListMonitorsInput) {
  return listMonitors(input);
}
