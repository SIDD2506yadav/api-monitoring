import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Monitor } from "@api-monitoring/database";
import { createMonitorResult } from "../repositories/monitor-result.repository";
import { executeMonitor } from "../services/monitor-execution.service";

vi.mock("../repositories/monitor-result.repository", () => ({
  createMonitorResult: vi.fn(),
}));

const mockedCreateMonitorResult = vi.mocked(createMonitorResult);

const monitor: Monitor = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  userId: "8c48b6be-c75c-4213-b3ba-7ab42876c5b6",
  name: "Example Monitor",
  url: "https://example.com",
  method: "GET",
  intervalSeconds: 60,
  timeoutMs: 5000,
  expectedStatusCode: 200,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("executeMonitor", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("records a successful result when the expected status is returned", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(null, {
          status: 200,
        }),
      ),
    );

    mockedCreateMonitorResult.mockResolvedValue({
      id: "result-id",
      monitorId: monitor.id,
      success: true,
      statusCode: 200,
      latencyMs: 10,
      errorMessage: null,
      checkedAt: new Date(),
    });

    await executeMonitor(monitor);

    expect(mockedCreateMonitorResult).toHaveBeenCalledWith(
      expect.objectContaining({
        monitorId: monitor.id,
        success: true,
        statusCode: 200,
      }),
    );
  });

  it("records a failed result when an unexpected status is returned", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(null, {
          status: 500,
        }),
      ),
    );

    mockedCreateMonitorResult.mockResolvedValue({
      id: "result-id",
      monitorId: monitor.id,
      success: false,
      statusCode: 500,
      latencyMs: 10,
      errorMessage: "Expected status 200, received 500",
      checkedAt: new Date(),
    });

    await executeMonitor(monitor);

    expect(mockedCreateMonitorResult).toHaveBeenCalledWith(
      expect.objectContaining({
        monitorId: monitor.id,
        success: false,
        statusCode: 500,
        errorMessage: "Expected status 200, received 500",
      }),
    );
  });

  it("records a failed result when the request times out", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(
        Object.assign(new Error("The operation was aborted"), {
          name: "TimeoutError",
        }),
      ),
    );

    mockedCreateMonitorResult.mockResolvedValue({
      id: "result-id",
      monitorId: monitor.id,
      success: false,
      statusCode: null,
      latencyMs: 5000,
      errorMessage: "Monitor request timed out",
      checkedAt: new Date(),
    });

    await executeMonitor({
      ...monitor,
      timeoutMs: 100,
    });

    expect(mockedCreateMonitorResult).toHaveBeenCalledWith(
      expect.objectContaining({
        monitorId: monitor.id,
        success: false,
        errorMessage: "Monitor request timed out",
      }),
    );
  });

  it("records a failed result when the request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("fetch failed")),
    );

    mockedCreateMonitorResult.mockResolvedValue({
      id: "result-id",
      monitorId: monitor.id,
      success: false,
      statusCode: null,
      latencyMs: 10,
      errorMessage: "fetch failed",
      checkedAt: new Date(),
    });

    await executeMonitor(monitor);

    expect(mockedCreateMonitorResult).toHaveBeenCalledWith(
      expect.objectContaining({
        monitorId: monitor.id,
        success: false,
        errorMessage: "fetch failed",
      }),
    );
  });
});
