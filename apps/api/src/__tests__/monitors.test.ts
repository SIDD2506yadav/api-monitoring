import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { errorHandler } from "../middleware/error-handler";
import { validateBody } from "../middleware/validate";
import { createMonitorSchema } from "../schemas/monitor";
import { listMonitorsSchema } from "../schemas/monitor";

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

testApp.use(errorHandler);

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
