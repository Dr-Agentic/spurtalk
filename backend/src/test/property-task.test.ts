import * as fc from "fast-check";
import { taskService } from "../services/task";
import { UserPreferences } from "@spurtalk/shared";

describe("Property 14: Task Metadata Assignment", () => {
  // effort level: 'Tiny' | 'Small' | 'Medium' | 'Big'
  // emotional tag: 'Boring' | 'Scary' | 'Fun'
  // motivation category: 'Relief' | 'Energy' | 'Achievement' | 'Identity'

  it("should accept and persist all valid metadata combinations", async () => {
    // This property test checks that any valid combination of metadata
    // defined in our schema is accepted by the service layer validation
    // In a real DB test we would save and retrieve, here we validate logic

    fc.assert(
      fc.property(
        fc.record({
          title: fc.string({ minLength: 1, maxLength: 100 }),
          effortLevel: fc.constantFrom("Tiny", "Small", "Medium", "Big"),
          emotionalTag: fc.constantFrom("Boring", "Scary", "Fun"),
          motivationCategory: fc.constantFrom(
            "Relief",
            "Energy",
            "Achievement",
            "Identity"
          ),
          fuzzyDeadline: fc.constantFrom("Soon", "This Week", "Eventually"),
          hardDeadline: fc.date(),
        }),
        (taskData) => {
          // Since we don't want to mock the DB for every run of fast-check (too slow),
          // we'll rely on our service's/schema's static validation logic or a lightweight check.
          // For now, let's verify that our Schema accepts these generated values.

          const { CreateTaskSchema } = require("@spurtalk/shared");
          const result = CreateTaskSchema.safeParse(taskData);
          return result.success;
        }
      )
    );
  });
});

describe("Property 15: Fuzzy Deadline Management", () => {
  it("should correctly calculate fuzzy deadlines based on hard deadlines and preferences", () => {
    const preferences: UserPreferences = {
      stallDetectionTimeout: 24,
      colorPalette: "default",
      fuzzyDeadlineLabels: {
        soon: 2,
        thisWeek: 7,
        eventually: 30,
      },
      notificationSettings: {
        taskReminders: true,
        stallDetection: true,
        milestoneCelebrations: true,
      },
      timezone: "UTC",
    };

    const now = new Date();

    fc.assert(
      fc.property(fc.integer({ min: -10, max: 60 }), (daysOffset) => {
        const hardDeadline = new Date(
          now.getTime() + daysOffset * 24 * 60 * 60 * 1000
        );
        const fuzzyLabel = taskService.calculateFuzzyDeadline(
          hardDeadline,
          preferences
        );

        if (daysOffset <= 2) {
          return fuzzyLabel === "Soon";
        } else if (daysOffset <= 7) {
          return fuzzyLabel === "This Week";
        } else {
          return fuzzyLabel === "Eventually";
        }
      })
    );
  });
});
