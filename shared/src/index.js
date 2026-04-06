"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTaskSchema = exports.CreateTaskSchema = exports.TaskResponseSchema = exports.NanoStepSchema = exports.TaskSchema = exports.UserPreferencesSchema = void 0;
const zod_1 = require("zod");
exports.UserPreferencesSchema = zod_1.z
    .object({
    stallDetectionTimeout: zod_1.z.number().min(1).max(168).default(24),
    colorPalette: zod_1.z.enum(["default", "high_contrast"]).default("default"),
    fuzzyDeadlineLabels: zod_1.z
        .object({
        soon: zod_1.z.number().default(2),
        thisWeek: zod_1.z.number().default(7),
        eventually: zod_1.z.number().default(30),
    })
        .default({
        soon: 2,
        thisWeek: 7,
        eventually: 30,
    }),
    notificationSettings: zod_1.z
        .object({
        taskReminders: zod_1.z.boolean().default(true),
        stallDetection: zod_1.z.boolean().default(true),
        milestoneCelebrations: zod_1.z.boolean().default(true),
    })
        .default({
        taskReminders: true,
        stallDetection: true,
        milestoneCelebrations: true,
    }),
    timezone: zod_1.z.string().default("UTC"),
})
    .default({
    stallDetectionTimeout: 24,
    colorPalette: "default",
    fuzzyDeadlineLabels: { soon: 2, thisWeek: 7, eventually: 30 },
    notificationSettings: {
        taskReminders: true,
        stallDetection: true,
        milestoneCelebrations: true,
    },
    timezone: "UTC",
});
exports.TaskSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(500),
    description: zod_1.z.string().optional(),
    effortLevel: zod_1.z.enum(["Tiny", "Small", "Medium", "Big"]),
    emotionalTag: zod_1.z.enum(["Boring", "Scary", "Fun", "Hard"]).optional(),
    fuzzyDeadline: zod_1.z.enum(["Soon", "This Week", "Eventually"]),
    hardDeadline: zod_1.z
        .string()
        .or(zod_1.z.date())
        .transform((val) => new Date(val)),
    compellingEvent: zod_1.z.string().optional(),
    motivationCategory: zod_1.z
        .enum(["Relief", "Energy", "Achievement", "Identity"])
        .optional(),
    dependencies: zod_1.z.array(zod_1.z.string()).default([]),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
    deckOrder: zod_1.z.number().optional(),
    parentTaskId: zod_1.z.string().optional(),
});
exports.NanoStepSchema = zod_1.z.object({
    id: zod_1.z.string(),
    text: zod_1.z.string(),
    estimatedSeconds: zod_1.z.number().max(120), // Max 2 minutes as per req
    emotionalEffort: zod_1.z.enum(["zero", "minimal"]),
    isCompleted: zod_1.z.boolean(),
    parentTaskId: zod_1.z.string(),
    generatedByAI: zod_1.z.boolean().optional(),
});
exports.TaskResponseSchema = exports.TaskSchema.extend({
    id: zod_1.z.string(),
    userId: zod_1.z.string(),
    state: zod_1.z.enum([
        "Deck",
        "River",
        "Garden",
        "Stalled",
        "Active",
        "Completed",
        "Tracking",
    ]),
    nanoSteps: zod_1.z.array(exports.NanoStepSchema).default([]),
    subtasks: zod_1.z.array(zod_1.z.lazy(() => exports.TaskResponseSchema)).optional(),
    parentTask: zod_1.z.lazy(() => exports.TaskResponseSchema).optional(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
    deckOrder: zod_1.z.number().optional(),
});
exports.CreateTaskSchema = zod_1.z
    .object({
    title: zod_1.z
        .string()
        .min(1, "Give your card a title")
        .max(500, "Keep the title under 500 characters - you can add more details in the description"),
    description: zod_1.z
        .string()
        .max(2000, "Description is a bit long - try keeping it under 2000 characters")
        .optional(),
    effortLevel: zod_1.z.enum(["Tiny", "Small", "Medium", "Big"], {
        message: "Let us know how big this feels",
    }),
    emotionalTag: zod_1.z.enum(["Boring", "Scary", "Fun", "Hard"]).optional(),
    fuzzyDeadline: zod_1.z.enum(["Soon", "This Week", "Eventually"]).optional(),
    hardDeadline: zod_1.z
        .string()
        .or(zod_1.z.date())
        .transform((val) => new Date(val))
        .optional(),
    tags: zod_1.z
        .union([
        zod_1.z.array(zod_1.z.string()),
        zod_1.z.string().transform((val) => val.split(",").map((t) => t.trim())),
    ])
        .default([]),
})
    .extend({
    dependencies: zod_1.z.array(zod_1.z.string()).optional(),
    compellingEvent: zod_1.z.string().optional(),
    motivationCategory: zod_1.z
        .enum(["Relief", "Energy", "Achievement", "Identity"])
        .optional(),
    parentTaskId: zod_1.z.string().optional(),
})
    .refine((data) => !(data.fuzzyDeadline && data.hardDeadline), {
    message: "Choose either a flexible timeframe or a specific date - not both",
    path: ["fuzzyDeadline"],
})
    .refine((data) => !data.hardDeadline || data.hardDeadline > new Date(), {
    message: "Pick a date in the future so you have time to work on it",
    path: ["hardDeadline"],
});
exports.UpdateTaskSchema = exports.TaskSchema.partial().extend({
    state: zod_1.z
        .enum([
        "Deck",
        "River",
        "Garden",
        "Stalled",
        "Active",
        "Completed",
        "Tracking",
    ])
        .optional(),
    nanoSteps: zod_1.z.array(exports.NanoStepSchema).optional(),
});
