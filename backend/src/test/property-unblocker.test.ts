import * as fc from "fast-check";
import { unblockerService } from "../services/unblocker";
import { PrismaClient } from "@prisma/client";
import { taskService } from "../services/task";
import { NanoStep } from "@spurtalk/shared";

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

describe("Property 7: Stall Detection", () => {
  let testUserId: string;
  let createdTaskIds: string[] = [];

  beforeEach(async () => {
    const user = await prisma.user.create({
      data: {
        email: `stall-test-${Date.now()}@example.com`,
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

  it("should only detect stalls for tasks older than timeout", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 0, max: 48 }), // Hours since update
        async (hoursSinceUpdate) => {
          const updatedAt = new Date(
            Date.now() - hoursSinceUpdate * 60 * 60 * 1000
          );

          // Create task directly with specific updatedAt using Prisma
          // (Service creates with now(), so we override)
          const task = await prisma.task.create({
            data: {
              userId: testUserId,
              title: `Stall Task ${hoursSinceUpdate}`,
              effortLevel: "Small",
              fuzzyDeadline: "Soon",
              hardDeadline: new Date(),
              state: "Active",
              updatedAt, // Override
              dependencies: [],
              tags: [],
            },
          });
          createdTaskIds.push(task.id);

          const stalledIds = await unblockerService.detectStalls(testUserId);
          const isStalled = stalledIds.includes(task.id);

          // Default timeout is 24h
          // Logic: if > 24 hours have passed, it SHOULD be stalled.
          // However, Prisma updatedAt might be slightly skewed or our test logic imperfect.
          // Let's allow boundary conditions (exactly 24h) to pass either way.
          if (hoursSinceUpdate > 24) {
            return isStalled === true;
          } else if (hoursSinceUpdate < 24) {
            return isStalled === false;
          }
          return true; // Boundary case 24h
        }
      ),
      { numRuns: 20 }
    );
  });
});

describe("Property 8: First Step Barrier Minimization", () => {
  let testUserId: string;
  let createdTaskIds: string[] = [];

  beforeEach(async () => {
    const user = await prisma.user.create({
      data: {
        email: `nano-test-${Date.now()}@example.com`,
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

  it("should always generate a first step with < 2 mins and zero effort", async () => {
    await fc.assert(
      fc.asyncProperty(fc.string(), async (taskTitle) => {
        const task = await taskService.createTask(testUserId, {
          title: taskTitle || "Nano Task",
          effortLevel: "Big",
          fuzzyDeadline: "Soon",
          hardDeadline: new Date(),
          dependencies: [],
          tags: [],
        });
        createdTaskIds.push(task.id);

        const steps = await unblockerService.decomposeTask(testUserId, task.id) as unknown as NanoStep[];

        if (steps.length === 0) return false;

        const firstStep = steps[0];
        // Requirement 4.4
        return (
          firstStep.estimatedSeconds <= 120 &&
          firstStep.emotionalEffort === "zero"
        );
      }),
      { numRuns: 10 }
    );
  });
});
