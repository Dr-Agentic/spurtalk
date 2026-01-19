import request from "supertest";
import express from "express";
import { apiLimiter, authLimiter } from "../middleware/rateLimit";

describe("Security Middleware", () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use("/api/auth", authLimiter);
    app.use("/api", apiLimiter);

    app.get("/api/test", (req, res) => res.json({ message: "success" }));
    app.post("/api/auth/login", (req, res) => res.json({ message: "login" }));
  });

  describe("Rate Limiting", () => {
    it("should allow requests within limit", async () => {
      const response = await request(app).get("/api/test");
      expect(response.status).toBe(200);
    });

    it("should set rate limit headers", async () => {
      const response = await request(app).get("/api/test");
      expect(response.headers).toHaveProperty("ratelimit-limit");
      expect(response.headers).toHaveProperty("ratelimit-remaining");
    });
  });
});
