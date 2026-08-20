import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import { errorHandler } from "../middleware/error-handler";
import { validateBody } from "../middleware/validate";

const testApp = express();

testApp.use(express.json());

testApp.post(
  "/test",
  validateBody(
    z.object({
      name: z.string().min(1),
    }),
  ),
  (_req, res) => {
    res.json({ status: "ok" });
  },
);

testApp.use(errorHandler);

describe("request validation", () => {
  it("returns a validation error for an invalid request body", async () => {
    const response = await request(testApp).post("/test").send({ name: 123 });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
    expect(response.body.error.message).toBe("Request validation failed");
  });

  it("allows a valid request body through", async () => {
    const response = await request(testApp)
      .post("/test")
      .send({ name: "test" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "ok",
    });
  });
});
