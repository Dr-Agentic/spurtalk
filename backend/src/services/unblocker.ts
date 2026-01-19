import { PrismaClient } from "@prisma/client";
import { NanoStep } from "@spurtalk/shared";

const prisma = new PrismaClient();

export class UnblockerService {
  async detectStalls(userId: string): Promise<string[]> {
    // Requirement 4.2: Task in Active state > 24 hours
    // Requirement 311: User configurable timeout (default 24h)

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { preferences: true },
    });

    // Default to 24 if preferences missing/invalid
    const timeoutHours =
      (user?.preferences as any)?.stallDetectionTimeout || 24;
    const timeoutDate = new Date(Date.now() - timeoutHours * 60 * 60 * 1000);

    const stalledTasks = await prisma.task.findMany({
      where: {
        userId,
        state: "Active",
        updatedAt: {
          lt: timeoutDate,
        },
        stallDetectedAt: null, // Only detect once until cleared
      },
    });

    const stalledIds: string[] = [];

    // Mark them as stalled (Requirement 4.2 implies automatic trigger)
    // We update stallDetectedAt. Requirement 4.3 says "decompose".
    // Let's mark them first.
    for (const task of stalledTasks) {
      await prisma.task.update({
        where: { id: task.id },
        data: {
          stallDetectedAt: new Date(),
          state: "Stalled", // Explicit state change per design
        },
      });
      stalledIds.push(task.id);
    }

    return stalledIds;
  }

  async decomposeTask(userId: string, taskId: string): Promise<NanoStep[]> {
    const task = await prisma.task.findFirst({
      where: { id: taskId, userId },
    });

    if (!task) throw new Error("Task not found");

    // Requirement 4.3: Decompose into 3-5 Nano_Steps
    // Requirement 4.4: First step < 2 mins, zero emotional effort

    // Placeholder rule-based decomposition (AI to replace later)
    const steps: NanoStep[] = [
      {
        id: crypto.randomUUID(),
        text: "Open the project folder/document",
        estimatedSeconds: 30,
        emotionalEffort: "zero",
        isCompleted: false,
        parentTaskId: taskId,
      },
      {
        id: crypto.randomUUID(),
        text: "Read the specific requirement or prompt",
        estimatedSeconds: 60,
        emotionalEffort: "zero",
        isCompleted: false,
        parentTaskId: taskId,
      },
      {
        id: crypto.randomUUID(),
        text: "Write the very first sentence/line",
        estimatedSeconds: 90,
        emotionalEffort: "minimal",
        isCompleted: false,
        parentTaskId: taskId,
      },
    ];

    await prisma.task.update({
      where: { id: taskId },
      data: {
        nanoSteps: steps as any,
        state: "Active", // Move back to active to work on steps? Or keep Stalled?
        // UX usually implies "Unblocked" -> Active. Let's set Active.
      },
    });

    return steps;
  }
}

export const unblockerService = new UnblockerService();
