import * as fc from "fast-check";
import { taskService } from "../services/task";
import { CreateTask } from "@spurtalk/shared";
import type { NanoStep } from "@spurtalk/shared";
import { PrismaClient } from "@prisma/client";

// Mock AI service to avoid external dependencies in tests
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

import { prisma } from "../lib/prisma";

describe("Property 10: Focus Deck Card Interaction", () => {
  jest.setTimeout(30000); // Higher timeout for DB-heavy property tests
  let testUserId: string;
  let createdTaskIds: string[] = [];

  beforeEach(async () => {
    // Create a test user
    const user = await prisma.user.create({
      data: {
        email: `property-deck-${Date.now()}@example.com`,
        passwordHash: "hashed-password",
      },
    });
    testUserId = user.id;
    createdTaskIds = [];
  });

  afterEach(async () => {
    if (createdTaskIds.length > 0) {
      await prisma.task.deleteMany({
        where: { id: { in: createdTaskIds } },
      });
    }
    if (testUserId) {
      try {
        await prisma.user.delete({
          where: { id: testUserId },
        });
      } catch (e) {
        // Ignore
      }
    }
  });

  it("should correctly transition state based on swipe direction", async () => {
    // Note: We reduce numRuns because database operations are slow
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom("right", "left", "down"),
        async (direction) => {
          // Setup: Create a task in 'Deck' state
          const taskData: CreateTask = {
            title: `Deck Prop Task ${Date.now()}`,
            effortLevel: "Small",
            fuzzyDeadline: "Soon",
            hardDeadline: new Date(),
            dependencies: [],
            tags: [],
          };

          const task = await taskService.createTask(testUserId, taskData);
          createdTaskIds.push(task.id);

          // Action: Swipe
          if (direction === "down") {
            const steps = await taskService.handleSwipe(
              testUserId,
              task.id,
              "down"
            ) as import("@spurtalk/shared").NanoStep[];
            return Array.isArray(steps) && steps.length > 0;
          }

          const updatedTask = await taskService.handleSwipe(
            testUserId,
            task.id,
            direction as "right" | "left"
          ) as unknown as import("@spurtalk/shared").Task;

          // Verification
          if (direction === "right") {
            return updatedTask.state === "Active";
          } else if (direction === "left") {
            return updatedTask.state === "Deck";
          }
          return false;
        }
      ),
      { numRuns: 20 }
    );
  });
});
