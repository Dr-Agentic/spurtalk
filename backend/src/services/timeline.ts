import { PrismaClient } from "@prisma/client";
import { Timeline, TimelineTask } from "@spurtalk/shared";

const prisma = new PrismaClient();

export class TimelineService {
  async generateTimeline(userId: string): Promise<Timeline> {
    const tasks = await prisma.task.findMany({
      where: {
        userId,
        state: "Active",
      },
      orderBy: { hardDeadline: "asc" },
    });

    const now = new Date();
    const timelineTasks: TimelineTask[] = tasks.map((task, index) => {
      const diffTime = new Date(task.hardDeadline).getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Determine visual style (Requirement 3.2, 3.3)
      let renderStyle: "clear" | "blurred" | "misty" = "clear";

      // Missed deadline handling (Requirement 3.4)
      // If deadline is passed (diffDays < 0), we still treat it as "clear" (immediate/urgent)
      // but without red coloring. The requirement says "flow around it".
      // Visually, it should remain prominent.

      if (diffDays > 7) {
        renderStyle = "misty";
      } else if (diffDays > 2) {
        renderStyle = "blurred";
      }
      // Implicit else: diffDays <= 2 (including negative/overdue) -> clear

      return {
        taskId: task.id,
        position: index,
        renderStyle,
        scheduledDate: new Date(task.hardDeadline),
        dependencies: task.dependencies as string[],
      };
    });

    // Logical dependency sequencing (Requirement 3.5)
    // Implement basic topological sorting to ensure dependencies come before dependent tasks
    const sortedTasks = this.sortTasksByDependencies(timelineTasks, tasks);

    // Store/Update timeline
    // For now, we calculate on the fly, but persistence is good for "generatedAt"

    return {
      id: "generated", // dynamic
      userId,
      tasks: sortedTasks,
      bufferDays: [], // Empathic planner adds these
      stressClusters: [],
      generatedAt: new Date(),
      lastModified: new Date(),
    };
  }

  async getTimeline(userId: string) {
    return this.generateTimeline(userId);
  }

  private sortTasksByDependencies(
    timelineTasks: TimelineTask[],
    tasks: any[]
  ): TimelineTask[] {
    // Create a map of taskId to task for easy lookup
    const taskMap = new Map<string, any>();
    tasks.forEach((task) => taskMap.set(task.id, task));

    // Create a map of taskId to its dependencies
    const dependencyMap = new Map<string, string[]>();
    timelineTasks.forEach((task) => {
      dependencyMap.set(task.taskId, task.dependencies);
    });

    // Implement a basic topological sort using Kahn's algorithm
    const inDegree = new Map<string, number>();
    const graph = new Map<string, string[]>();

    // Initialize in-degree and build graph
    timelineTasks.forEach((task) => {
      inDegree.set(task.taskId, 0);
      graph.set(task.taskId, []);
    });

    // Build the dependency graph
    timelineTasks.forEach((task) => {
      task.dependencies.forEach((depId) => {
        if (graph.has(depId)) {
          graph.get(depId)?.push(task.taskId);
          inDegree.set(task.taskId, (inDegree.get(task.taskId) || 0) + 1);
        }
      });
    });

    // Find all tasks with no dependencies
    const queue: string[] = [];
    inDegree.forEach((degree, taskId) => {
      if (degree === 0) {
        queue.push(taskId);
      }
    });

    const sortedResult: TimelineTask[] = [];
    const taskPositionMap = new Map<string, TimelineTask>();
    timelineTasks.forEach((task) => taskPositionMap.set(task.taskId, task));

    // Process the queue
    while (queue.length > 0) {
      const currentTaskId = queue.shift()!;
      const currentTask = taskPositionMap.get(currentTaskId);
      if (currentTask) {
        sortedResult.push(currentTask);

        // Decrement in-degree of dependent tasks
        const dependents = graph.get(currentTaskId) || [];
        dependents.forEach((dependentId) => {
          const newDegree = (inDegree.get(dependentId) || 0) - 1;
          inDegree.set(dependentId, newDegree);

          if (newDegree === 0) {
            queue.push(dependentId);
          }
        });
      }
    }

    // If there are remaining tasks with dependencies, they form a cycle
    // For now, we'll just append them to the end
    timelineTasks.forEach((task) => {
      if (!sortedResult.some((t) => t.taskId === task.taskId)) {
        sortedResult.push(task);
      }
    });

    // Update positions to be sequential
    return sortedResult.map((task, index) => ({
      ...task,
      position: index,
    }));
  }
}

export const timelineService = new TimelineService();
