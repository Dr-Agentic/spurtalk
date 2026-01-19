import * as fc from "fast-check";
import { timelineService } from "../services/timeline";
import { PrismaClient } from "@prisma/client";
import { CreateTask } from "@spurtalk/shared";
import { taskService } from "../services/task";

const prisma = new PrismaClient();

describe("Property 5: River Timeline Visual Hierarchy", () => {
  let testUserId: string;
  let createdTaskIds: string[] = [];

  beforeEach(async () => {
    const user = await prisma.user.create({
      data: {
        email: `timeline-test-${Date.now()}@example.com`,
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

  it("should assign correct visual hierarchy based on temporal distance", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 0, max: 14 }), // Days from now
        async (daysFromNow) => {
          const hardDeadline = new Date();
          hardDeadline.setDate(hardDeadline.getDate() + daysFromNow);

          const taskData: CreateTask = {
            title: `Timeline Task ${daysFromNow}`,
            effortLevel: "Small",
            fuzzyDeadline: "Soon",
            hardDeadline,
            dependencies: [],
            tags: [],
          };

          const task = await taskService.createTask(testUserId, taskData);
          await taskService.updateTask(testUserId, task.id, {
            state: "Active",
          });
          createdTaskIds.push(task.id);

          const timeline = await timelineService.getTimeline(testUserId);
          const timelineTask = timeline.tasks.find(
            (t: any) => t.taskId === task.id
          );

          if (!timelineTask) return false;

          // Logic verification
          // 0-2 days: clear (Active/Focus)
          // 3-7 days: blurred (Upcoming)
          // >7 days: misty (Future)
          // Note: our service uses Math.ceil diffDays.
          // diffDays of 0 means today (very soon).

          // We need to match the logic in timeline.ts exactly or the intent.
          // In timeline.ts:
          // diffDays > 7 -> misty
          // diffDays > 2 -> blurred
          // else -> clear

          // Let's assume daysFromNow corresponds roughly to diffDays (ignoring milliseconds for this property test)
          // Since we set date + daysFromNow, diff is ~daysFromNow * 24h.

          if (daysFromNow > 7) {
            return timelineTask.renderStyle === "misty";
          } else if (daysFromNow > 2) {
            return timelineTask.renderStyle === "blurred";
          } else {
            return timelineTask.renderStyle === "clear";
          }
        }
      ),
      { numRuns: 20 }
    );
  });
});
