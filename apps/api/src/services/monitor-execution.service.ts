import { createMonitorResult } from "../repositories/monitor-result.repository";
import { getMonitor } from "../repositories/monitor.repository";

type Monitor = NonNullable<Awaited<ReturnType<typeof getMonitor>>>;

export async function executeMonitor(monitor: Monitor) {
  const checkedAt = new Date();
  const startTime = Date.now();

  try {
    const response = await fetch(monitor.url, {
      method: monitor.method,
      signal: AbortSignal.timeout(monitor.timeoutMs),
    });

    const latencyMs = Date.now() - startTime;
    const success = response.status === monitor.expectedStatusCode;

    return createMonitorResult({
      monitorId: monitor.id,
      success,
      statusCode: response.status,
      latencyMs,
      checkedAt,
      ...(success
        ? {}
        : {
            errorMessage: `Expected status ${monitor.expectedStatusCode}, received ${response.status}`,
          }),
    });
  } catch (error) {
    const latencyMs = Date.now() - startTime;

    let errorMessage = "Monitor request failed";

    if (error instanceof Error) {
      errorMessage =
        error.name === "TimeoutError"
          ? "Monitor request timed out"
          : error.message;
    }

    return createMonitorResult({
      monitorId: monitor.id,
      success: false,
      latencyMs,
      errorMessage,
      checkedAt,
    });
  }
}

export async function checkMonitorService(id: string) {
  const monitor = await getMonitor(id);

  if (!monitor) {
    return null;
  }

  return executeMonitor(monitor);
}
