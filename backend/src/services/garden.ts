import { PrismaClient } from "@prisma/client";
import { GardenState, GardenElement } from "@spurtalk/shared";
import type { Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class GardenService {
  async getGardenState(userId: string): Promise<GardenState> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { gardenState: true },
    });

    if (!user) throw new Error("User not found");

    return user.gardenState as unknown as GardenState;
  }

  async processTaskCompletion(
    userId: string,
    taskId: string
  ): Promise<GardenState> {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task || task.userId !== userId) throw new Error("Task not found");

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { gardenState: true },
    });

    if (!user) throw new Error("User not found");

    let state = user.gardenState as unknown as GardenState;

    // Initialize if empty
    if (!state || !state.elements) {
      state = {
        userId,
        elements: [],
        sunBrightness: 0.5,
        currentStreak: 0,
        longestStreak: 0,
        totalFlowers: 0,
        totalTrees: 0,
        lastUpdated: new Date(),
      };
    }

    // Determine element type based on effort (Requirement 6.1, 6.2)
    const type =
      task.effortLevel === "Big" || task.effortLevel === "Medium"
        ? "tree"
        : "flower";

    // Create new element
    const newElement: GardenElement = {
      id: crypto.randomUUID(),
      type,
      position: this.calculateNextPosition(state.elements.length), // Simple grid layout for now
      size: type === "tree" ? 2 : 1,
      color: this.getRandomPsychologicalSafetyColor(),
      taskId,
      createdAt: new Date(),
    };

    // Update stats
    state.elements.push(newElement);
    if (type === "tree") state.totalTrees++;
    else state.totalFlowers++;

    // Update streak (Requirement 6.3)
    // Basic daily streak logic: check if lastUpdated was yesterday or today
    const now = new Date();
    const lastUpdate = new Date(state.lastUpdated);
    const diffHours = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);

    if (diffHours < 24 && now.getDate() !== lastUpdate.getDate()) {
      // Completed task on a new consecutive day
      state.currentStreak++;
    } else if (diffHours >= 48) {
      // Streak broken
      state.currentStreak = 1;
    } else if (state.currentStreak === 0) {
      state.currentStreak = 1;
    }

    state.longestStreak = Math.max(state.currentStreak, state.longestStreak);

    // Sun brightness increases with streak (Requirement 6.3)
    // Max brightness 1.0, min 0.5, +0.1 per streak day
    state.sunBrightness = Math.min(0.5 + state.currentStreak * 0.1, 1.0);

    state.lastUpdated = now;

    // Persist
    await prisma.user.update({
      where: { id: userId },
      data: { gardenState: state as unknown as Prisma.InputJsonValue },
    });

    return state;
  }

  private calculateNextPosition(index: number) {
    // Simple spiral or grid logic placeholder
    // x, y coordinates
    const rowLength = 5;
    return {
      x: (index % rowLength) * 20,
      y: Math.floor(index / rowLength) * 20,
    };
  }

  private getRandomPsychologicalSafetyColor() {
    // Requirement 2.1: deep lavenders, sage greens, warm sand, teal
    const colors = [
      "#8b7cf6", // Lavender
      "#10b981", // Sage
      "#f59e0b", // Sand
      "#14b8a6", // Teal
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}

export const gardenService = new GardenService();
