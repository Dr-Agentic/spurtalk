import { taskService } from "../services/task";
import { CreateTask } from "@spurtalk/shared";
import { prisma } from "../lib/prisma";

describe("Hierarchy Integration", () => {
    let testUserId: string;
    let parentId: string;
    const cleanupIds: string[] = [];

    beforeAll(async () => {
        // Create a test user
        const user = await prisma.user.create({
            data: {
                email: `hierarchy-test-${Date.now()}@example.com`,
                passwordHash: "hashed-password",
            },
        });
        testUserId = user.id;
    });

    afterAll(async () => {
        if (cleanupIds.length > 0) {
            await prisma.task.deleteMany({
                where: { id: { in: cleanupIds } },
            });
        }
        if (testUserId) {
            await prisma.user.delete({ where: { id: testUserId } });
        }
    });

    beforeEach(async () => {
        // Create a fresh parent for each test
        const parent = await taskService.createTask(testUserId, {
            title: "Main Project",
            effortLevel: "Big",
            fuzzyDeadline: "Eventually",
            tags: [],
        });
        parentId = parent.id;
        cleanupIds.push(parentId);
    });

    describe("createSubtasks", () => {
        it("should batch create subtasks and move parent to Tracking", async () => {
            const subtasks: CreateTask[] = [
                { title: "Subtask 1", effortLevel: "Small", tags: [] },
                { title: "Subtask 2", effortLevel: "Tiny", tags: [] },
            ];

            const created = await taskService.createSubtasks(testUserId, parentId, subtasks);
            expect(created).toHaveLength(2);
            created.forEach(t => cleanupIds.push(t.id));

            const updatedParent = await taskService.getTask(testUserId, parentId);
            expect(updatedParent.state).toBe("Tracking");
            expect(updatedParent.subtasks).toHaveLength(2);
        });

        it("should handle 'replace' strategy by wiping existing children", async () => {
            // 1. Add initial children
            await taskService.createSubtasks(testUserId, parentId, [
                { title: "Old Child", effortLevel: "Small", tags: [] }
            ]);

            // 2. Replace with new roadmap
            const newRoadmap: CreateTask[] = [
                { title: "New Roadmap 1", effortLevel: "Small", tags: [] },
                { title: "New Roadmap 2", effortLevel: "Small", tags: [] }
            ];

            const created = await taskService.createSubtasks(testUserId, parentId, newRoadmap, "replace");
            expect(created).toHaveLength(2);
            created.forEach(t => cleanupIds.push(t.id));

            const parent = await taskService.getTask(testUserId, parentId);
            expect(parent.subtasks).toHaveLength(2);
            expect(parent.subtasks?.map(t => t.title)).not.toContain("Old Child");
        });

        it("should handle 'supplement' strategy by adding to existing children", async () => {
            // 1. Add initial children
            await taskService.createSubtasks(testUserId, parentId, [
                { title: "Existing Child", effortLevel: "Small", tags: [] }
            ]);

            // 2. Supplement with more
            const additions: CreateTask[] = [
                { title: "Supplement 1", effortLevel: "Small", tags: [] }
            ];

            const created = await taskService.createSubtasks(testUserId, parentId, additions, "supplement");
            expect(created).toHaveLength(1);
            created.forEach(t => cleanupIds.push(t.id));

            const parent = await taskService.getTask(testUserId, parentId);
            expect(parent.subtasks).toHaveLength(2);
            const titles = parent.subtasks?.map(t => t.title);
            expect(titles).toContain("Existing Child");
            expect(titles).toContain("Supplement 1");
        });
    });

    describe("Auto-Completion Logic", () => {
        it("should finish parent when last child moves to Garden", async () => {
            // 1. Setup hierarchy
            const children = await taskService.createSubtasks(testUserId, parentId, [
                { title: "Child A", effortLevel: "Small", tags: [] },
                { title: "Child B", effortLevel: "Small", tags: [] }
            ]);
            children.forEach(t => cleanupIds.push(t.id));

            // 2. Finish first child
            await taskService.updateTask(testUserId, children[0].id, { state: "Garden" });
            let parent = await taskService.getTask(testUserId, parentId);
            expect(parent.state).toBe("Tracking");

            // 3. Finish second child
            await taskService.updateTask(testUserId, children[1].id, { state: "Garden" });
            parent = await taskService.getTask(testUserId, parentId);
            expect(parent.state).toBe("Garden");
        });
    });
});
