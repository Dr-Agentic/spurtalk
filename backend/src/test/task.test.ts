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

    it("should move parent to Tracking when child is created", async () => {
      // 1. Create Parent Task
      const parent = await taskService.createTask(testUserId, {
        title: "Parent Project",
        effortLevel: "Big",
        fuzzyDeadline: "Eventually",
        hardDeadline: new Date(),
        dependencies: [],
        tags: [],
      });
      createdTaskIds.push(parent.id);
      expect(parent.state).toBe("Deck");

      // 2. Create Child Task linked to Parent
      const child = await taskService.createTask(testUserId, {
        title: "Child Task",
        effortLevel: "Small",
        fuzzyDeadline: "Soon",
        hardDeadline: new Date(),
        dependencies: [],
        tags: [],
        parentTaskId: parent.id,
      });
      createdTaskIds.push(child.id);

      // 3. Check Parent State
      const updatedParent = await taskService.getTask(testUserId, parent.id);
      expect(updatedParent.state).toBe("Tracking");
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

  describe("Task State Logic", () => {
    it("should allow Deck -> Active transition (TEST-001)", async () => {
      const task = await taskService.createTask(testUserId, {
        title: "Deck Task",
        effortLevel: "Tiny",
        fuzzyDeadline: "Soon",
        hardDeadline: new Date(),
        dependencies: [],
        tags: [],
      });

      const updated = await taskService.updateTask(testUserId, task.id, {
        state: "Active",
      });
      expect(updated.state).toBe("Active");
    });

    it("should fail Garden -> Deck transition (TEST-002)", async () => {
      const task = await taskService.createTask(testUserId, {
        title: "Garden Task",
        effortLevel: "Tiny",
        fuzzyDeadline: "Soon",
        hardDeadline: new Date(),
        dependencies: [],
        tags: [],
      });

      // Move to Garden first
      await taskService.updateTask(testUserId, task.id, { state: "Garden" });

      await expect(
        taskService.updateTask(testUserId, task.id, { state: "Deck" })
      ).rejects.toThrow("Cannot move task back to Deck from Garden");
    });

    it("should auto-complete Parent when last child finishes (TEST-003)", async () => {
      // 1. Create Parent Task
      const parent = await taskService.createTask(testUserId, {
        title: "Parent Project",
        effortLevel: "Big",
        fuzzyDeadline: "Eventually",
        hardDeadline: new Date(),
        dependencies: [],
        tags: [],
      });
      // Set parent to Tracking state (assuming it's a project)
      await taskService.updateTask(testUserId, parent.id, {
        state: "Tracking",
      });

      // 2. Create Child Tasks linked to Parent
      // Note: We need to use Prisma directly to set parentTaskId if create schema doesn't support it yet
      const child1 = await prisma.task.create({
        data: {
          userId: testUserId,
          title: "Child 1",
          effortLevel: "Small",
          fuzzyDeadline: "Soon",
          hardDeadline: new Date(),
          state: "Deck",
          parentTaskId: parent.id,
        },
      });

      const child2 = await prisma.task.create({
        data: {
          userId: testUserId,
          title: "Child 2",
          effortLevel: "Small",
          fuzzyDeadline: "Soon",
          hardDeadline: new Date(),
          state: "Deck",
          parentTaskId: parent.id,
        },
      });

      // 3. Complete Child 1 -> Parent should remain Tracking
      await taskService.updateTask(testUserId, child1.id, { state: "Garden" });
      const parentAfter1 = await taskService.getTask(testUserId, parent.id);
      expect(parentAfter1.state).toBe("Tracking");

      // 4. Complete Child 2 -> Parent should move to Garden
      await taskService.updateTask(testUserId, child2.id, { state: "Garden" });
      const parentAfter2 = await taskService.getTask(testUserId, parent.id);
      expect(parentAfter2.state).toBe("Garden");
    });

    it("should identify stalled tasks (TEST-004)", async () => {
      const task = await taskService.createTask(testUserId, {
        title: "Stalled Task",
        effortLevel: "Tiny",
        fuzzyDeadline: "Soon",
        hardDeadline: new Date(),
        dependencies: [],
        tags: [],
      });

      // Set to Active
      await taskService.updateTask(testUserId, task.id, { state: "Active" });

      // Manually update updatedAt to be in the past (e.g., 48 hours ago)
      const twoDaysAgo = new Date();
      twoDaysAgo.setHours(twoDaysAgo.getHours() - 48);

      await prisma.task.update({
        where: { id: task.id },
        data: { updatedAt: twoDaysAgo },
      });

      // Run stall detection
      const stalledCount = await taskService.detectStalledTasks(testUserId);
      expect(stalledCount).toBe(1);

      const stalledTask = await taskService.getTask(testUserId, task.id);
      expect(stalledTask.state).toBe("Stalled");
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
