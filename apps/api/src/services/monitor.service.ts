import { createMonitor } from "../repositories/monitor.repository";
import type { CreateMonitorInput } from "../schemas/monitor";

export async function createMonitorService(input: CreateMonitorInput) {
  return createMonitor(input);
}
