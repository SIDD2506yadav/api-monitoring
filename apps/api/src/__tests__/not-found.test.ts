import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../app";

describe("404 handling", () => {
  it("returns a standardized not found response", async () => {
    const response = await request(app).get("/does-not-exist");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: {
        code: "NOT_FOUND",
        message: "Resource not found",
      },
    });
  });
});
