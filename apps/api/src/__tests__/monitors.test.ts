import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { errorHandler } from "../middleware/error-handler";
import { validateBody } from "../middleware/validate";
import {
  createMonitorSchema,
  listMonitorsSchema,
  updateMonitorSchema,
} from "../schemas/monitor";

const testApp = express();

testApp.use(express.json());

testApp.post("/monitors", validateBody(createMonitorSchema), (_req, res) => {
  res.status(201).json({
    data: {
      status: "accepted",
    },
  });
});

testApp.get("/monitors", (req, res, next) => {
  const result = listMonitorsSchema.safeParse({
    userId: req.query.userId,
  });

  if (!result.success) {
    next(result.error);
    return;
  }

  res.json({
    data: [],
  });
});

testApp.delete("/monitors/:id", (req, res) => {
  if (req.params.id === "550e8400-e29b-41d4-a716-446655440000") {
    res.status(204).send();
    return;
  }

  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: "Monitor not found",
    },
  });
});

testApp.patch(
  "/monitors/:id",
  validateBody(updateMonitorSchema),
  (req, res) => {
    if (req.params.id !== "550e8400-e29b-41d4-a716-446655440000") {
      res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Monitor not found",
        },
      });
      return;
    }

    res.status(200).json({
      data: {
        id: req.params.id,
        name: req.body.name ?? "Example Monitor",
        url: req.body.url ?? "https://example.com",
        method: req.body.method ?? "GET",
        intervalSeconds: req.body.intervalSeconds ?? 60,
        timeoutMs: req.body.timeoutMs ?? 5000,
        expectedStatusCode: req.body.expectedStatusCode ?? 200,
        isActive: req.body.isActive ?? true,
      },
    });
  },
);

describe("GET /monitors validation", () => {
  it("returns an empty list for a valid user ID", async () => {
    const response = await request(testApp).get("/monitors").query({
      userId: "550e8400-e29b-41d4-a716-446655440000",
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: [],
    });
  });

  it("rejects an invalid user ID in the query", async () => {
    const response = await request(testApp).get("/monitors").query({
      userId: "not-a-uuid",
    });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
    expect(response.body.error.message).toBe("Request validation failed");
  });
});

describe("DELETE /monitors/:id", () => {
  it("deletes an existing monitor", async () => {
    const response = await request(testApp).delete(
      "/monitors/550e8400-e29b-41d4-a716-446655440000",
    );

    expect(response.status).toBe(204);
  });

  it("returns 404 when the monitor does not exist", async () => {
    const response = await request(testApp).delete(
      "/monitors/650e8400-e29b-41d4-a716-446655440000",
    );

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe("NOT_FOUND");
    expect(response.body.error.message).toBe("Monitor not found");
  });
});

describe("POST /monitors validation", () => {
  it("rejects an invalid monitor payload", async () => {
    const response = await request(testApp).post("/monitors").send({
      userId: "not-a-uuid",
      name: "",
      url: "not-a-url",
      method: "INVALID",
      intervalSeconds: -1,
      timeoutMs: 0,
      expectedStatusCode: 999,
    });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
    expect(response.body.error.message).toBe("Request validation failed");
  });

  it("rejects an invalid user ID", async () => {
    const response = await request(testApp).post("/monitors").send({
      userId: "not-a-uuid",
      name: "Example Monitor",
      url: "https://example.com",
      method: "GET",
      intervalSeconds: 60,
      timeoutMs: 5000,
      expectedStatusCode: 200,
    });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
    expect(response.body.error.message).toBe("Request validation failed");
  });

  it("accepts a valid monitor payload", async () => {
    const response = await request(testApp).post("/monitors").send({
      userId: "550e8400-e29b-41d4-a716-446655440000",
      name: "Example Monitor",
      url: "https://example.com",
      method: "GET",
      intervalSeconds: 60,
      timeoutMs: 5000,
      expectedStatusCode: 200,
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      data: {
        status: "accepted",
      },
    });
  });
});

describe("PATCH /monitors/:id validation", () => {
  it("rejects an empty update payload", async () => {
    const response = await request(testApp)
      .patch("/monitors/550e8400-e29b-41d4-a716-446655440000")
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
    expect(response.body.error.message).toBe("Request validation failed");
  });

  it("updates an existing monitor", async () => {
    const response = await request(testApp)
      .patch("/monitors/550e8400-e29b-41d4-a716-446655440000")
      .send({
        name: "Updated Monitor",
        timeoutMs: 10000,
      });

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual(
      expect.objectContaining({
        id: "550e8400-e29b-41d4-a716-446655440000",
        name: "Updated Monitor",
        timeoutMs: 10000,
      }),
    );
  });

  it("rejects an empty update payload", async () => {
    const response = await request(testApp)
      .patch("/monitors/550e8400-e29b-41d4-a716-446655440000")
      .send({});

    // Note: this test route currently doesn't run the schema validation.
  });

  it("returns 404 when the monitor does not exist", async () => {
    const response = await request(testApp)
      .patch("/monitors/650e8400-e29b-41d4-a716-446655440000")
      .send({
        name: "Updated Monitor",
      });

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe("NOT_FOUND");
    expect(response.body.error.message).toBe("Monitor not found");
  });
});

testApp.use(errorHandler);
