import request from "supertest";
import { pool } from "../config/database";

jest.mock("../services/ai", () => ({
  aiService: {
    decomposeTask: jest.fn().mockResolvedValue([
      { text: "Mock Step 1", estimatedSeconds: 30, emotionalEffort: "zero" },
      { text: "Mock Step 2", estimatedSeconds: 60, emotionalEffort: "zero" },
    ]),
    generateCompellingEvent: jest.fn().mockResolvedValue("Mock Compelling Event"),
    analyzeDocument: jest.fn().mockResolvedValue({
      extractedText: "Mock text",
      parsedTasks: [],
      confidence: 0.9,
    }),
  },
}));

// Import test app - uses CommonJS export
// eslint-disable-next-line @typescript-eslint/no-var-requires
const app = require("../../test-server");

describe("Route Integration Tests - Real User Flow", () => {
  let authToken: string;
  let testUserId: string;
  let testTaskId: string;

  beforeAll(async () => {
    // Step 1: Create a real test user (signup flow)
    const signupResponse = await request(app)
      .post("/api/auth/register")
      .send({
        email: `test-${Date.now()}@example.com`, // Unique email
        password: "test-password-123",
      });

    expect(signupResponse.status).toBe(201);
    expect(signupResponse.body).toHaveProperty("user");
    expect(signupResponse.body).toHaveProperty("tokens");

    testUserId = signupResponse.body.user.id;
    authToken = signupResponse.body.tokens.accessToken;
  });

  afterAll(async () => {
    // Step 5: Cleanup - delete test user
    const client = await pool.connect();
    try {
      await client.query(`DELETE FROM users WHERE id = $1`, [testUserId]);
      console.log("Test user cleaned up successfully");
    } catch (error) {
      console.warn("Cleanup failed:", error);
    } finally {
      client.release();
    }
  });

  describe("Health Check", () => {
    it("should return health status", async () => {
      const response = await request(app).get("/health");
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("status", "ok");
      expect(response.body).toHaveProperty("timestamp");
    });
  });

  describe("Task Routes", () => {
    it("should create a new task", async () => {
      const newTask = {
        title: "Test Task",
        description: "This is a test task",
        effortLevel: "Small",
        fuzzyDeadline: "Soon",
        hardDeadline: new Date(Date.now() + 86400000).toISOString(),
      };

      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${authToken}`)
        .send(newTask);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.title).toBe(newTask.title);
      testTaskId = response.body.id;
    });

    it("should get all tasks", async () => {
      const response = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it("should get a specific task", async () => {
      const response = await request(app)
        .get(`/api/tasks/${testTaskId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(testTaskId);
    });

    it("should update a task", async () => {
      const updates = {
        title: "Updated Test Task",
        description: "This task has been updated",
      };

      const response = await request(app)
        .put(`/api/tasks/${testTaskId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe(updates.title);
    });

    it("should delete a task", async () => {
      const response = await request(app)
        .delete(`/api/tasks/${testTaskId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(204);
    });
  });

  describe("Document Routes", () => {
    it("should get user documents", async () => {
      const response = await request(app)
        .get("/api/documents")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("Error Handling", () => {
    it("should handle invalid task ID", async () => {
      const response = await request(app)
        .get("/api/tasks/invalid-id")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });

    it("should handle missing authentication", async () => {
      const response = await request(app).get("/api/tasks");
      expect(response.status).toBe(401);
    });
  });
});
