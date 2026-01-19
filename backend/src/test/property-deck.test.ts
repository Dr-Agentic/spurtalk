import * as fc from "fast-check";
import { taskService } from "../services/task";
import { CreateTask, UpdateTask, CreateTaskSchema } from "@spurtalk/shared";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Property 10: Focus Deck Card Interaction", () => {
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
    await prisma.user.delete({
      where: { id: testUserId },
    });
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
          const updatedTask = await taskService.handleSwipe(
            testUserId,
            task.id,
            direction as any
          );

          // Verification
          if (direction === "right") {
            return updatedTask.state === "Active";
          } else if (direction === "left") {
            return updatedTask.state === "Deck";
          } else if (direction === "down") {
            const steps = updatedTask.nanoSteps as any[];
            return (
              updatedTask.state === "Deck" &&
              Array.isArray(steps) &&
              steps.length > 0
            );
          }
          return false;
        }
      ),
      { numRuns: 20 }
    );
  });
});
