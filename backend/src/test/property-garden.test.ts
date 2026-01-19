import * as fc from "fast-check";
import { gardenService } from "../services/garden";
import { PrismaClient } from "@prisma/client";
import { taskService } from "../services/task";
import { CreateTask } from "@spurtalk/shared";

const prisma = new PrismaClient();

describe("Property 12: Garden Element Generation", () => {
  let testUserId: string;
  let createdTaskIds: string[] = [];

  beforeEach(async () => {
    const user = await prisma.user.create({
      data: {
        email: `garden-test-${Date.now()}@example.com`,
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
      await prisma.user.delete({
        where: { id: testUserId },
      });
    }
  });

  it("should generate correct garden elements based on task effort", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom("Tiny", "Small", "Medium", "Big"),
        async (effortLevel) => {
          const taskData: CreateTask = {
            title: `Garden Task ${Date.now()}`,
            effortLevel: effortLevel as any,
            fuzzyDeadline: "Soon",
            hardDeadline: new Date(),
            dependencies: [],
            tags: [],
          };

          const task = await taskService.createTask(testUserId, taskData);
          createdTaskIds.push(task.id);

          const newState = await gardenService.processTaskCompletion(
            testUserId,
            task.id
          );
          const element = newState.elements.find(
            (e: any) => e.taskId === task.id
          );

          if (!element) return false;

          // Requirement 6.1, 6.2
          if (effortLevel === "Tiny" || effortLevel === "Small") {
            return element.type === "flower";
          } else {
            return element.type === "tree";
          }
        }
      ),
      { numRuns: 20 }
    );
  });
});
