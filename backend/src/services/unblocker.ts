import { PrismaClient, type Prisma } from "@prisma/client";
import { NanoStep } from "@spurtalk/shared";
import { aiService } from "./ai";
import { prisma } from "../lib/prisma";

export class UnblockerService {
  async detectStalls(userId: string): Promise<string[]> {
    // ... same as before
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { preferences: true },
    });

    const timeoutHours =
      (user?.preferences as Prisma.JsonObject | null)?.stallDetectionTimeout as number || 24;
    const timeoutDate = new Date(Date.now() - timeoutHours * 60 * 60 * 1000);

    const stalledTasks = await prisma.task.findMany({
      where: {
        userId,
        state: "Active",
        updatedAt: {
          lt: timeoutDate,
        },
        stallDetectedAt: null,
      },
    });

    const stalledIds: string[] = [];

    for (const task of stalledTasks) {
      await prisma.task.update({
        where: { id: task.id },
        data: {
          stallDetectedAt: new Date(),
          state: "Stalled",
        },
      });
      stalledIds.push(task.id);
    }

    return stalledIds;
  }

  async decomposeTask(userId: string, taskId: string): Promise<Prisma.TaskGetPayload<NonNullable<unknown>>> {
    const task = await prisma.task.findFirst({
      where: { id: taskId, userId },
    });

    if (!task) throw new Error("Task not found");

    // Requirement 4.3: Decompose into 3-5 Nano_Steps using AI
    const aiSteps = await aiService.decomposeTask(task.title, task.description);

    const steps: NanoStep[] = aiSteps.map((step) => ({
      id: crypto.randomUUID(),
      text: step.text,
      estimatedSeconds: step.estimatedSeconds,
      emotionalEffort: step.emotionalEffort,
      isCompleted: false,
      parentTaskId: taskId,
      generatedByAI: true,
    }));

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        nanoSteps: steps as unknown as Prisma.InputJsonValue,
        // stay in Deck state so user can decide to snooze or start
      },
    });

    return updatedTask;
  }
}

export const unblockerService = new UnblockerService();
