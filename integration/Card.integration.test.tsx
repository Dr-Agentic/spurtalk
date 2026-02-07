import express from "express";
import request from "supertest";

// Card routes are protected by auth middleware; for integration tests we bypass
// JWT verification and inject a stable userId.
jest.mock("../../backend/src/middleware/auth", () => ({
  authenticateToken: (req: any, _res: any, next: any) => {
    req.userId = "test-user";
    next();
  },
}));

import cardRoutes from "../../backend/src/routes/cardRoutes";

const makeApp = () => {
  const app = express();
  app.use(express.json());
  app.use("/cards", cardRoutes);
  return app;
};

describe("Card API integration flow", () => {
  test("full lifecycle flow succeeds (open -> ready -> finish)", async () => {
    const app = makeApp();
    const id = `card-${Date.now()}`;

    const openRes = await request(app)
      .post(`/cards/${id}/open`)
      .set("Authorization", "Bearer test")
      .send({});
    expect(openRes.status).toBe(200);
    expect(openRes.body).toMatchObject({
      id,
      userId: "test-user",
      state: "loading",
    });

    const readyRes = await request(app)
      .post(`/cards/${id}/ready`)
      .set("Authorization", "Bearer test")
      .send({});
    expect(readyRes.status).toBe(200);
    expect(readyRes.body).toMatchObject({
      id,
      userId: "test-user",
      state: "active",
    });

    const finishRes = await request(app)
      .post(`/cards/${id}/finish`)
      .set("Authorization", "Bearer test")
      .send({});
    expect(finishRes.status).toBe(200);
    expect(finishRes.body).toMatchObject({
      id,
      userId: "test-user",
      state: "completed",
    });
    expect(finishRes.body.completedAt).toBeTruthy();
  });

  test("close transitions to discarded and blocks repeat close", async () => {
    const app = makeApp();
    const id = `card-${Date.now()}-discard`;

    await request(app)
      .post(`/cards/${id}/open`)
      .set("Authorization", "Bearer test")
      .send({});
    await request(app)
      .post(`/cards/${id}/ready`)
      .set("Authorization", "Bearer test")
      .send({});

    const closeRes = await request(app)
      .post(`/cards/${id}/close`)
      .set("Authorization", "Bearer test")
      .send({});
    expect(closeRes.status).toBe(200);
    expect(closeRes.body).toMatchObject({
      id,
      userId: "test-user",
      state: "discarded",
    });

    const closeAgainRes = await request(app)
      .post(`/cards/${id}/close`)
      .set("Authorization", "Bearer test")
      .send({});
    expect(closeAgainRes.status).toBe(400);
    expect(closeAgainRes.body).toMatchObject({
      error: "Card is already discarded",
    });
  });
});
