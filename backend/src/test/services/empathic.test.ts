import { TimelineService } from "../../services/timeline";
import { AiService } from "../../services/ai";
import { AuthService } from "../../services/auth";
import { PrismaClient } from "@prisma/client";

// Mock Prisma
jest.mock("@prisma/client", () => {
    const mPrisma = {
        user: {
            findUnique: jest.fn(),
        },
        task: {
            findMany: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        },
        document: {
            findMany: jest.fn(),
        }
    };
    return { PrismaClient: jest.fn(() => mPrisma) };
});

const prisma = new PrismaClient() as any;

describe("Empathic Planning Unit Tests", () => {
    let timelineService: TimelineService;
    let authService: AuthService;

    beforeEach(() => {
        timelineService = new TimelineService();
        authService = new AuthService();
        jest.clearAllMocks();
    });

    describe("TimelineService - Stress Clusters & Buffer Days", () => {
        it("should detect stress clusters when task density is high", async () => {
            const mockTasks = [
                { id: "1", effortLevel: "Big", hardDeadline: new Date("2026-02-10") },
                { id: "2", effortLevel: "Big", hardDeadline: new Date("2026-02-10") },
                { id: "3", effortLevel: "Medium", hardDeadline: new Date("2026-02-11") },
            ];

            const movieDate = new Date("2026-02-10");
            const timelineTasks = mockTasks.map(t => ({
                taskId: t.id,
                scheduledDate: movieDate,
                position: 0,
                renderStyle: "clear" as const,
                dependencies: []
            }));

            // Access private method for testing or use public generateTimeline
            // For coverage of the new logic, we test the detection
            const clusters = (timelineService as any).detectStressClusters(timelineTasks, mockTasks);
            expect(clusters.length).toBeGreaterThan(0);
            expect(clusters[0].severity).toBe("high");
        });

        it("should insert buffer days before stress clusters", () => {
            const clusters = [{
                startDate: new Date("2026-02-10"),
                endDate: new Date("2026-02-12"),
                severity: "high" as const,
                taskCount: 3
            }];

            const bufferDays = (timelineService as any).insertBufferDays(clusters, []);
            expect(bufferDays.length).toBe(1);
            expect(bufferDays[0].reason).toContain("high stress cluster");
            // One day before
            expect(bufferDays[0].date.toISOString()).toBe(new Date("2026-02-09").toISOString());
        });
    });

    describe("AuthService - Data Export", () => {
        it("should retrieve and sanitize user data for export", async () => {
            const mockUser = {
                id: "u1",
                email: "test@example.com",
                passwordHash: "secret",
                tasks: [{ id: "t1", title: "Task 1" }],
                documents: [
                    { id: "d1", title: "Doc 1", confidence: "0.95" } // String works with Number()
                ]
            };

            prisma.user.findUnique.mockResolvedValue(mockUser);

            const exported = await authService.exportUserData("u1");

            expect(exported).not.toHaveProperty("passwordHash");
            expect(exported.email).toBe("test@example.com");
            expect(exported.documents[0].confidence).toBe(0.95);
        });

        it("should throw error if user not found during export", async () => {
            prisma.user.findUnique.mockResolvedValue(null);
            await expect(authService.exportUserData("nonexistent")).rejects.toThrow("User not found");
        });
    });
});
