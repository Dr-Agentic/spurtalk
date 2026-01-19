"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTaskSchema = exports.CreateTaskSchema = exports.TaskResponseSchema = exports.NanoStepSchema = exports.TaskSchema = exports.UserPreferencesSchema = void 0;
const zod_1 = require("zod");
exports.UserPreferencesSchema = zod_1.z.object({
    stallDetectionTimeout: zod_1.z.number().min(1).max(168).default(24),
    colorPalette: zod_1.z.enum(["default", "high_contrast"]).default("default"),
    fuzzyDeadlineLabels: zod_1.z.object({
        soon: zod_1.z.number().default(2),
        thisWeek: zod_1.z.number().default(7),
        eventually: zod_1.z.number().default(30),
    }),
    notificationSettings: zod_1.z.object({
        taskReminders: zod_1.z.boolean().default(true),
        stallDetection: zod_1.z.boolean().default(true),
        milestoneCelebrations: zod_1.z.boolean().default(true),
    }),
    timezone: zod_1.z.string().default("UTC"),
});
exports.TaskSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required").max(500),
    description: zod_1.z.string().optional(),
    effortLevel: zod_1.z.enum(["Tiny", "Small", "Medium", "Big"]),
    emotionalTag: zod_1.z.enum(["Boring", "Scary", "Fun"]).optional(),
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
});
exports.NanoStepSchema = zod_1.z.object({
    id: zod_1.z.string(),
    text: zod_1.z.string(),
    estimatedSeconds: zod_1.z.number().max(120), // Max 2 minutes as per req
    emotionalEffort: zod_1.z.enum(["zero", "minimal"]),
    isCompleted: zod_1.z.boolean(),
    parentTaskId: zod_1.z.string(),
});
exports.TaskResponseSchema = exports.TaskSchema.extend({
    id: zod_1.z.string(),
    userId: zod_1.z.string(),
    state: zod_1.z.enum(["Deck", "River", "Garden", "Stalled", "Active", "Completed"]),
    nanoSteps: zod_1.z.array(exports.NanoStepSchema).default([]),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
    deckOrder: zod_1.z.number().optional(),
});
exports.CreateTaskSchema = exports.TaskSchema;
exports.UpdateTaskSchema = exports.TaskSchema.partial().extend({
    state: zod_1.z
        .enum(["Deck", "River", "Garden", "Stalled", "Active", "Completed"])
        .optional(),
    nanoSteps: zod_1.z.array(exports.NanoStepSchema).optional(),
});
