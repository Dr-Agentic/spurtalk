import { CreateTaskSchema, TaskSchema, UserPreferencesSchema } from "./index";

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

  describe("CreateTaskSchema", () => {
    it("should validate a valid task with all required fields", () => {
      const validTask = {
        title: "Test Task",
        effortLevel: "Small",
        tags: [],
      };
      const result = CreateTaskSchema.safeParse(validTask);
      expect(result.success).toBe(true);
    });

    it("should validate a task with fuzzy deadline", () => {
      const validTask = {
        title: "Test Task",
        effortLevel: "Medium",
        fuzzyDeadline: "Soon",
        tags: [],
      };
      const result = CreateTaskSchema.safeParse(validTask);
      expect(result.success).toBe(true);
    });

    it("should validate a task with hard deadline", () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      const validTask = {
        title: "Test Task",
        effortLevel: "Big",
        hardDeadline: futureDate.toISOString(),
        tags: [],
      };
      const result = CreateTaskSchema.safeParse(validTask);
      expect(result.success).toBe(true);
    });

    it("should fail with empty title and show friendly error", () => {
      const invalidTask = {
        title: "",
        effortLevel: "Small",
        tags: [],
      };
      const result = CreateTaskSchema.safeParse(invalidTask);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "Give your card a title"
        );
      }
    });

    it("should fail when title exceeds 500 characters", () => {
      const invalidTask = {
        title: "a".repeat(501),
        effortLevel: "Small",
        tags: [],
      };
      const result = CreateTaskSchema.safeParse(invalidTask);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some((issue) => issue.message.includes("500"))
        ).toBe(true);
      }
    });

    it("should accept title with exactly 500 characters", () => {
      const validTask = {
        title: "a".repeat(500),
        effortLevel: "Small",
        tags: [],
      };
      const result = CreateTaskSchema.safeParse(validTask);
      expect(result.success).toBe(true);
    });

    it("should fail when effortLevel is missing with friendly error", () => {
      const invalidTask = {
        title: "Test Task",
        tags: [],
      };
      const result = CreateTaskSchema.safeParse(invalidTask);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "Let us know how big this feels"
        );
      }
    });

    it("should fail when both fuzzyDeadline and hardDeadline are provided", () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      const invalidTask = {
        title: "Test Task",
        effortLevel: "Small",
        fuzzyDeadline: "Soon",
        hardDeadline: futureDate.toISOString(),
        tags: [],
      };
      const result = CreateTaskSchema.safeParse(invalidTask);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some((issue) =>
            issue.message.includes("Choose either")
          )
        ).toBe(true);
      }
    });

    it("should fail when hardDeadline is in the past", () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      const invalidTask = {
        title: "Test Task",
        effortLevel: "Small",
        hardDeadline: pastDate.toISOString(),
        tags: [],
      };
      const result = CreateTaskSchema.safeParse(invalidTask);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some((issue) => issue.message.includes("future"))
        ).toBe(true);
      }
    });

    it("should fail when description exceeds 2000 characters", () => {
      const invalidTask = {
        title: "Test Task",
        effortLevel: "Small",
        description: "a".repeat(2001),
        tags: [],
      };
      const result = CreateTaskSchema.safeParse(invalidTask);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some((issue) => issue.message.includes("2000"))
        ).toBe(true);
      }
    });

    it("should accept description with exactly 2000 characters", () => {
      const validTask = {
        title: "Test Task",
        effortLevel: "Small",
        description: "a".repeat(2000),
        tags: [],
      };
      const result = CreateTaskSchema.safeParse(validTask);
      expect(result.success).toBe(true);
    });

    it("should parse tags array correctly", () => {
      const validTask = {
        title: "Test Task",
        effortLevel: "Small",
        tags: ["work", "urgent", "personal"],
      };
      const result = CreateTaskSchema.safeParse(validTask);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.tags).toEqual(["work", "urgent", "personal"]);
      }
    });

    it("should accept optional emotionalTag", () => {
      const validTask = {
        title: "Test Task",
        effortLevel: "Small",
        emotionalTag: "Fun",
        tags: [],
      };
      const result = CreateTaskSchema.safeParse(validTask);
      expect(result.success).toBe(true);
    });

    it("should accept task with only required fields", () => {
      const validTask = {
        title: "Minimal Task",
        effortLevel: "Tiny",
      };
      const result = CreateTaskSchema.safeParse(validTask);
      expect(result.success).toBe(true);
    });

    it("should parse tags from comma-separated string", () => {
      const validTask = {
        title: "Test Task",
        effortLevel: "Small",
        tags: "work,urgent,personal",
      };
      const result = CreateTaskSchema.safeParse(validTask);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.tags).toEqual(["work", "urgent", "personal"]);
      }
    });

    it("should trim whitespace from tags in comma-separated string", () => {
      const validTask = {
        title: "Test Task",
        effortLevel: "Small",
        tags: " work ,  urgent  , personal ",
      };
      const result = CreateTaskSchema.safeParse(validTask);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.tags).toEqual(["work", "urgent", "personal"]);
      }
    });

    it("should accept emotionalTag with Hard value", () => {
      const validTask = {
        title: "Test Task",
        effortLevel: "Small",
        emotionalTag: "Hard",
        tags: [],
      };
      const result = CreateTaskSchema.safeParse(validTask);
      expect(result.success).toBe(true);
    });

    it("should accept emotionalTag with Scary value", () => {
      const validTask = {
        title: "Test Task",
        effortLevel: "Small",
        emotionalTag: "Scary",
        tags: [],
      };
      const result = CreateTaskSchema.safeParse(validTask);
      expect(result.success).toBe(true);
    });
  });
});
