import { taskService } from "../services/task";
import { CreateTask, UpdateTask } from "@spurtalk/shared";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("TaskService", () => {
  let testUserId: string;
  let createdTaskIds: string[] = [];

  beforeEach(async () => {
    // Create a test user
    const user = await prisma.user.create({
      data: {
        email: `task-test-${Date.now()}@example.com`,
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
    // Delete the test user
    if (testUserId) {
      await prisma.user.delete({
        where: { id: testUserId },
      });
    }
  });

  describe("Create Task", () => {
    it("should create a task with valid data", async () => {
      const taskData: CreateTask = {
        title: "Test Task",
        description: "Test Description",
        effortLevel: "Small",
        emotionalTag: "Fun",
        fuzzyDeadline: "Soon",
        hardDeadline: new Date(),
        compellingEvent: "Finish line",
        motivationCategory: "Achievement",
        dependencies: [],
        tags: ["test"],
      };

      const task = await taskService.createTask(testUserId, taskData);
      createdTaskIds.push(task.id);

      expect(task).toBeDefined();
      expect(task.title).toBe(taskData.title);
      expect(task.state).toBe("Deck");
      expect(task.userId).toBe(testUserId);
    });

    it("should fail with invalid dependencies", async () => {
      const taskData: CreateTask = {
        title: "Task with invalid deps",
        effortLevel: "Small",
        fuzzyDeadline: "Soon",
        hardDeadline: new Date(),
        dependencies: ["non-existent-id"],
        tags: [],
      };

      await expect(
        taskService.createTask(testUserId, taskData)
      ).rejects.toThrow("Invalid dependencies");
    });
  });

  describe("Update Task", () => {
    it("should update task state", async () => {
      const task = await taskService.createTask(testUserId, {
        title: "Task to update",
        effortLevel: "Tiny",
        fuzzyDeadline: "Soon",
        hardDeadline: new Date(),
        dependencies: [],
        tags: [],
      });
      createdTaskIds.push(task.id);

      const updateData: UpdateTask = {
        state: "Active",
      };

      const updatedTask = await taskService.updateTask(
        testUserId,
        task.id,
        updateData
      );
      expect(updatedTask.state).toBe("Active");
    });

    it("should prevent circular dependencies (self-reference)", async () => {
      const task = await taskService.createTask(testUserId, {
        title: "Task for circular dep",
        effortLevel: "Tiny",
        fuzzyDeadline: "Soon",
        hardDeadline: new Date(),
        dependencies: [],
        tags: [],
      });
      createdTaskIds.push(task.id);

      await expect(
        taskService.updateTask(testUserId, task.id, {
          dependencies: [task.id],
        })
      ).rejects.toThrow("Task cannot depend on itself");
    });
  });

  describe("Get Tasks", () => {
    it("should filter tasks by state", async () => {
      const task1 = await taskService.createTask(testUserId, {
        title: "Deck Task",
        effortLevel: "Tiny",
        fuzzyDeadline: "Soon",
        hardDeadline: new Date(),
        dependencies: [],
        tags: [],
      });
      createdTaskIds.push(task1.id);

      const task2 = await taskService.createTask(testUserId, {
        title: "Active Task",
        effortLevel: "Tiny",
        fuzzyDeadline: "Soon",
        hardDeadline: new Date(),
        dependencies: [],
        tags: [],
      });
      createdTaskIds.push(task2.id);

      await taskService.updateTask(testUserId, task2.id, { state: "Active" });

      const deckTasks = await taskService.getTasks(testUserId, {
        state: "Deck",
      });
      expect(deckTasks.find((t) => t.id === task1.id)).toBeDefined();
      expect(deckTasks.find((t) => t.id === task2.id)).toBeUndefined();

      const activeTasks = await taskService.getTasks(testUserId, {
        state: "Active",
      });
      expect(activeTasks.find((t) => t.id === task2.id)).toBeDefined();
      expect(activeTasks.find((t) => t.id === task1.id)).toBeUndefined();
    });
  });

  describe("Delete Task", () => {
    it("should delete existing task", async () => {
      const task = await taskService.createTask(testUserId, {
        title: "Task to delete",
        effortLevel: "Tiny",
        fuzzyDeadline: "Soon",
        hardDeadline: new Date(),
        dependencies: [],
        tags: [],
      });
      createdTaskIds.push(task.id); // Add to cleanup just in case delete fails

      await taskService.deleteTask(testUserId, task.id);

      await expect(taskService.getTask(testUserId, task.id)).rejects.toThrow(
        "Task not found"
      );
    });
  });
});
