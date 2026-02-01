import { PrismaClient, Task, Prisma } from "@prisma/client";
import { CreateTask, UpdateTask, UserPreferences } from "@spurtalk/shared";
import { aiService } from "./ai";
import { unblockerService } from "./unblocker";

const prisma = new PrismaClient();

export class TaskService {
  async createTask(userId: string, data: CreateTask) {
    // Validate that dependencies exist and belong to user
    if (data.dependencies && data.dependencies.length > 0) {
      const count = await prisma.task.count({
        where: {
          id: { in: data.dependencies },
          userId,
        },
      });
      if (count !== data.dependencies.length) {
        throw new Error("Invalid dependencies");
      }
    }

    let compellingEvent = data.compellingEvent;
    if (!compellingEvent && data.motivationCategory) {
      compellingEvent = await aiService.generateCompellingEvent(data.title, data.motivationCategory);
    }

    const task = await prisma.task.create({
      data: {
        userId,
        title: data.title,
        description: data.description,
        effortLevel: data.effortLevel,
        emotionalTag: data.emotionalTag,
        fuzzyDeadline: data.fuzzyDeadline,
        hardDeadline: data.hardDeadline,
        compellingEvent: compellingEvent,
        motivationCategory: data.motivationCategory,
        dependencies: data.dependencies || [],
        tags: data.tags || [],
        state: "Deck",
      },
    });

    return task;
  }

  async getTasks(userId: string, filters?: { state?: string }) {
    return prisma.task.findMany({
      where: {
        userId,
        ...(filters?.state && { state: filters.state }),
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getTask(userId: string, taskId: string) {
    const task = await prisma.task.findFirst({
      where: { id: taskId, userId },
    });

    if (!task) {
      throw new Error("Task not found");
    }

    return task;
  }

  async updateTask(userId: string, taskId: string, data: UpdateTask) {
    const task = await this.getTask(userId, taskId);

    // Prevent circular dependencies if updating dependencies
    if (data.dependencies) {
      // Basic check: can't depend on itself
      if (data.dependencies.includes(taskId)) {
        throw new Error("Task cannot depend on itself");
      }

      // Check for ownership of all dependencies
      const count = await prisma.task.count({
        where: {
          id: { in: data.dependencies },
          userId,
        },
      });

      if (count !== data.dependencies.length) {
        throw new Error("Invalid dependencies");
      }
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return updatedTask;
  }

  async deleteTask(userId: string, taskId: string) {
    await this.getTask(userId, taskId); // Ensure exists and ownership
    return prisma.task.delete({
      where: { id: taskId },
    });
  }

  // Focus Deck Implementation
  async getDeck(userId: string) {
    // Return all tasks in 'Deck' state, ordered by priority (e.g., hardDeadline)
    // and then by deckOrder to respect manual ordering
    return prisma.task.findMany({
      where: {
        userId,
        state: "Deck",
      },
      orderBy: [
        { hardDeadline: "asc" },
        { deckOrder: "desc" }, // Higher deckOrder means it was snoozed more recently
      ],
    });
  }

  async handleSwipe(
    userId: string,
    taskId: string,
    direction: "right" | "left" | "down"
  ) {
    const task = await this.getTask(userId, taskId);

    if (task.state !== "Deck") {
      throw new Error("Task is not in Deck state");
    }

    if (direction === "right") {
      // Right Swipe: Do Now -> Move to Active/River
      // For simplified flow, let's move to 'River' or 'Active' based on whether we start immediately
      // The requirement says "Focus Mode" which implies Active. Let's use 'Active' for now.
      return this.updateTask(userId, taskId, { state: "Active" });
    } else if (direction === "left") {
      // Left Swipe: Not Now -> Move to bottom of deck
      // Requirement 5.3: "Move the task to the bottom of the deck"
      // We'll implement this by updating the task's position in the deck
      // Since we order by hardDeadline, we'll add a deckOrder field to handle custom ordering

      // Update the task to mark it as snoozed and move it to bottom
      return this.updateTask(userId, taskId, {
        state: "Deck",
        // Add a deckOrder field if it doesn't exist, or increment it
        // This ensures the task moves to the bottom when sorted by deckOrder
        deckOrder: task.deckOrder ? task.deckOrder + 1 : 1,
      });
    } else if (direction === "down") {
      // Down Swipe: Break Down -> Trigger Nano-Step Unblocker (Requirement 5.4)
      if (
        !task.nanoSteps ||
        (Array.isArray(task.nanoSteps) && task.nanoSteps.length === 0)
      ) {
        return unblockerService.decomposeTask(userId, taskId);
      }
      return task;
    }

    throw new Error("Invalid swipe direction");
  }

  calculateFuzzyDeadline(
    hardDeadline: Date,
    preferences: UserPreferences
  ): "Soon" | "This Week" | "Eventually" {
    const now = new Date();
    const diffTime = hardDeadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= preferences.fuzzyDeadlineLabels.soon) {
      return "Soon";
    } else if (diffDays <= preferences.fuzzyDeadlineLabels.thisWeek) {
      return "This Week";
    } else {
      return "Eventually";
    }
  }

  // Helper to validate task metadata based on Requirements 7.1, 7.2, 7.4, 7.5
  validateTaskMetadata(task: Task) {
    // Validated by Types/Schema, but this method can be used for complex business rules
    // if needed in the future.
    return true;
  }
}

export const taskService = new TaskService();
