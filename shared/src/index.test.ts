import { TaskSchema, CreateTaskSchema, UserPreferencesSchema } from "./index";

describe("Shared Schemas", () => {
    describe("TaskSchema", () => {
        it("should validate a valid task", () => {
            const validTask = {
                title: "Test Task",
                effortLevel: "Small",
                fuzzyDeadline: "Soon",
                hardDeadline: new Date().toISOString(),
                dependencies: [],
                tags: [],
            };
            const result = TaskSchema.safeParse(validTask);
            expect(result.success).toBe(true);
        });

        it("should fail if title is missing", () => {
            const invalidTask = {
                effortLevel: "Small",
                fuzzyDeadline: "Soon",
                hardDeadline: new Date(),
            };
            const result = TaskSchema.safeParse(invalidTask);
            expect(result.success).toBe(false);
        });
    });

    describe("UserPreferencesSchema", () => {
        it("should use default values", () => {
            const result = UserPreferencesSchema.parse({
                fuzzyDeadlineLabels: {},
                notificationSettings: {},
            });
            expect(result.stallDetectionTimeout).toBe(24);
            expect(result.colorPalette).toBe("default");
            expect(result.fuzzyDeadlineLabels.soon).toBe(2);
        });
    });
});
