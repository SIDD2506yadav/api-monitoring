import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { errorHandler } from "../middleware/error-handler";

const testApp = express();

testApp.get("/test-error", () => {
  throw new Error("Something went wrong internally");
});

testApp.use(errorHandler);

describe("error handling", () => {
  it("returns a standardized internal server error", async () => {
    const response = await request(testApp).get("/test-error");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred",
      },
    });
  });
});
