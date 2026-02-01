import { PrismaClient } from "@prisma/client";
import { Timeline, TimelineTask, BufferDay, StressCluster } from "@spurtalk/shared";

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

    // 1. Sequence tasks logically (topological sort)
    const sortedTasks = this.sortTasksByDependencies(timelineTasks, tasks);

    // 2. Detect Stress Clusters (Requirement 1.4)
    const stressClusters = this.detectStressClusters(sortedTasks, tasks);

    // 3. Insert Buffer Days (Requirement 1.5, 8.2)
    const bufferDays = this.insertBufferDays(stressClusters, sortedTasks);

    return {
      id: `timeline_${userId}_${now.getTime()}`,
      userId,
      tasks: sortedTasks,
      bufferDays,
      stressClusters,
      generatedAt: now,
      lastModified: now,
    };
  }

  async getTimeline(userId: string) {
    return this.generateTimeline(userId);
  }

  private detectStressClusters(
    timelineTasks: TimelineTask[],
    tasks: any[]
  ): StressCluster[] {
    const taskMap = new Map<string, any>();
    tasks.forEach((t) => taskMap.set(t.id, t));

    const effortWeights: Record<string, number> = {
      Tiny: 1,
      Small: 2,
      Medium: 4,
      Big: 8,
    };

    // Sort timeline tasks by date
    const sortedByDate = [...timelineTasks].sort(
      (a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime()
    );

    const clusters: StressCluster[] = [];
    const windowDays = 3;
    const stressThreshold = 10; // Effort total in window to consider "stressed"

    for (let i = 0; i < sortedByDate.length; i++) {
      const startDate = sortedByDate[i].scheduledDate;
      const endDate = new Date(startDate.getTime() + windowDays * 24 * 60 * 60 * 1000);

      let currentEffort = 0;
      let clusterTasks = 0;

      for (let j = i; j < sortedByDate.length; j++) {
        if (sortedByDate[j].scheduledDate <= endDate) {
          const originalTask = taskMap.get(sortedByDate[j].taskId);
          currentEffort += effortWeights[originalTask?.effortLevel || "Small"];
          clusterTasks++;
        } else {
          break;
        }
      }

      if (currentEffort >= stressThreshold) {
        clusters.push({
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          severity: currentEffort > 15 ? "high" : currentEffort > 12 ? "medium" : "low",
          taskCount: clusterTasks,
        });
        // Skip ahead to end of cluster to avoid overlapping small clusters?
        // Let's keep it simple for now and just find all windows.
      }
    }

    // Merge overlapping clusters
    return this.mergeClusters(clusters);
  }

  private mergeClusters(clusters: StressCluster[]): StressCluster[] {
    if (clusters.length <= 1) return clusters;

    const merged: StressCluster[] = [];
    let current = clusters[0];

    for (let i = 1; i < clusters.length; i++) {
      if (clusters[i].startDate <= current.endDate) {
        // Overlap
        current.endDate = new Date(Math.max(current.endDate.getTime(), clusters[i].endDate.getTime()));
        current.taskCount = Math.max(current.taskCount, clusters[i].taskCount);
        // Take highest severity
        const severities: Record<string, number> = { low: 1, medium: 2, high: 3 };
        if (severities[clusters[i].severity] > severities[current.severity]) {
          current.severity = clusters[i].severity;
        }
      } else {
        merged.push(current);
        current = clusters[i];
      }
    }
    merged.push(current);
    return merged;
  }

  private insertBufferDays(
    clusters: StressCluster[],
    timelineTasks: TimelineTask[]
  ): BufferDay[] {
    const bufferDays: BufferDay[] = [];

    clusters.forEach((cluster) => {
      // Requirement 1.5: "Rest periods automatically inserted before high-stress deadlines"
      // We'll insert one day before the start of the cluster
      const bufferDate = new Date(cluster.startDate.getTime() - 24 * 60 * 60 * 1000);

      bufferDays.push({
        date: bufferDate,
        reason: `Rest period before ${cluster.severity} stress cluster`,
        isInserted: true,
      });
    });

    return bufferDays;
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
