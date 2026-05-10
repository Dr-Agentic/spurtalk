import { PrismaClient } from "@prisma/client";
import { prisma } from "../lib/prisma";

export interface MomentumSessionResult {
  id: string;
  durationSeconds: number;
  completed: boolean;
  earnedFlower: boolean;
  totalSecondsWorked: number;
}

export class MomentumService {
  async startSession(userId: string, taskId: string, durationSeconds = 300): Promise<string> {
    // Verify task belongs to user
    const task = await prisma.task.findFirst({
      where: { id: taskId, userId },
    });

    if (!task) throw new Error("Task not found");

    // Create session record
    const session = await prisma.momentumSession.create({
      data: {
        userId,
        taskId,
        durationSeconds,
      },
    });

    return session.id;
  }

  async completeSession(
    userId: string,
    sessionId: string,
    actualSecondsWorked: number
  ): Promise<MomentumSessionResult> {
    const session = await prisma.momentumSession.findFirst({
      where: { id: sessionId, userId },
    });

    if (!session) throw new Error("Session not found");

    const completedAt = new Date();
    const earnedFlower = actualSecondsWorked >= 300; // Full 5 min = flower

    await prisma.momentumSession.update({
      where: { id: sessionId },
      data: {
        completedAt,
        durationSeconds: actualSecondsWorked,
        earnedFlower,
      },
    });

    // If earned a flower, also complete the task in garden
    if (earnedFlower) {
      const { gardenService } = await import("./garden");
      await gardenService.processTaskCompletion(userId, session.taskId);
    }

    return {
      id: sessionId,
      durationSeconds: actualSecondsWorked,
      completed: true,
      earnedFlower,
      totalSecondsWorked: actualSecondsWorked,
    };
  }

  async abandonSession(
    userId: string,
    sessionId: string,
    actualSecondsWorked: number
  ): Promise<MomentumSessionResult> {
    const session = await prisma.momentumSession.findFirst({
      where: { id: sessionId, userId },
    });

    if (!session) throw new Error("Session not found");

    const completedAt = new Date();
    const earnedFlower = actualSecondsWorked >= 300;

    await prisma.momentumSession.update({
      where: { id: sessionId },
      data: {
        completedAt,
        durationSeconds: actualSecondsWorked,
        earnedFlower,
      },
    });

    // Partial credit: at least 5 min = partial flower (counts toward streak even if task not completed)
    // But do NOT trigger garden completion unless they finished the task

    return {
      id: sessionId,
      durationSeconds: actualSecondsWorked,
      completed: false, // abandoned, not earned
      earnedFlower,
      totalSecondsWorked: actualSecondsWorked,
    };
  }

  async getSessionStats(userId: string) {
    const sessions = await prisma.momentumSession.findMany({
      where: { userId },
      orderBy: { startedAt: "desc" },
      take: 30,
    });

    const totalSessions = sessions.length;
    const completedSessions = sessions.filter((s) => s.completedAt).length;
    const flowersEarned = sessions.filter((s) => s.earnedFlower).length;
    const totalSeconds = sessions.reduce((sum, s) => sum + s.durationSeconds, 0);

    return {
      totalSessions,
      completedSessions,
      flowersEarned,
      totalSecondsWorked: totalSeconds,
    };
  }
}

export const momentumService = new MomentumService();