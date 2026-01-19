import { taskService } from "../services/task";
import { CreateTask } from "@spurtalk/shared";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Focus Deck", () => {
  let testUserId: string;
  let createdTaskIds: string[] = [];

  beforeEach(async () => {
    const user = await prisma.user.create({
      data: {
        email: `deck-test-${Date.now()}@example.com`,
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

  const createTestTask = async (
    title: string,
    state: "Deck" | "Active" = "Deck"
  ) => {
    const taskData: CreateTask = {
      title,
      effortLevel: "Small",
      fuzzyDeadline: "Soon",
      hardDeadline: new Date(),
      dependencies: [],
      tags: [],
    };
    const task = await taskService.createTask(testUserId, taskData);
    if (state !== "Deck") {
      await taskService.updateTask(testUserId, task.id, { state });
    }
    createdTaskIds.push(task.id);
    return task;
  };

  describe("getDeck", () => {
    it("should return only tasks in Deck state", async () => {
      await createTestTask("Deck Task 1", "Deck");
      await createTestTask("Active Task", "Active");
      await createTestTask("Deck Task 2", "Deck");

      const deck = await taskService.getDeck(testUserId);
      expect(deck).toHaveLength(2);
      expect(deck.every((t) => t.state === "Deck")).toBe(true);
    });
  });

  describe("handleSwipe", () => {
    it("should handle right swipe (move to Active)", async () => {
      const task = await createTestTask("Swipe Right Task");

      const updatedTask = await taskService.handleSwipe(
        testUserId,
        task.id,
        "right"
      );
      expect(updatedTask.state).toBe("Active");
    });

    it("should handle left swipe (stay in Deck)", async () => {
      const task = await createTestTask("Swipe Left Task");

      const updatedTask = await taskService.handleSwipe(
        testUserId,
        task.id,
        "left"
      );
      expect(updatedTask.state).toBe("Deck");
    });

    it("should handle down swipe (generate nano-steps)", async () => {
      const task = await createTestTask("Swipe Down Task");
      expect(task.nanoSteps).toEqual([]); // Initially empty/default

      const updatedTask = await taskService.handleSwipe(
        testUserId,
        task.id,
        "down"
      );

      // We cast to any because we know it's an array in our simple implementation
      const steps = updatedTask.nanoSteps as any[];
      expect(steps.length).toBeGreaterThan(0);
      expect(steps[0].emotionalEffort).toBe("zero");
    });

    it("should fail if task is not in Deck", async () => {
      const task = await createTestTask("Active Task", "Active");

      await expect(
        taskService.handleSwipe(testUserId, task.id, "right")
      ).rejects.toThrow("Task is not in Deck state");
    });
  });
});
