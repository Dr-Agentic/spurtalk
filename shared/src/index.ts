import { z } from "zod";

export const UserPreferencesSchema = z.object({
  stallDetectionTimeout: z.number().min(1).max(168).default(24),
  colorPalette: z.enum(["default", "high_contrast"]).default("default"),
  fuzzyDeadlineLabels: z.object({
    soon: z.number().default(2),
    thisWeek: z.number().default(7),
    eventually: z.number().default(30),
  }).default({}),
  notificationSettings: z.object({
    taskReminders: z.boolean().default(true),
    stallDetection: z.boolean().default(true),
    milestoneCelebrations: z.boolean().default(true),
  }).default({}),
  timezone: z.string().default("UTC"),
}).default({});

export const TaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(500),
  description: z.string().optional(),
  effortLevel: z.enum(["Tiny", "Small", "Medium", "Big"]),
  emotionalTag: z.enum(["Boring", "Scary", "Fun"]).optional(),
  fuzzyDeadline: z.enum(["Soon", "This Week", "Eventually"]),
  hardDeadline: z
    .string()
    .or(z.date())
    .transform((val) => new Date(val)),
  compellingEvent: z.string().optional(),
  motivationCategory: z
    .enum(["Relief", "Energy", "Achievement", "Identity"])
    .optional(),
  dependencies: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  deckOrder: z.number().optional(),
});

export const NanoStepSchema = z.object({
  id: z.string(),
  text: z.string(),
  estimatedSeconds: z.number().max(120), // Max 2 minutes as per req
  emotionalEffort: z.enum(["zero", "minimal"]),
  isCompleted: z.boolean(),
  parentTaskId: z.string(),
  generatedByAI: z.boolean().optional(),
});

export const TaskResponseSchema = TaskSchema.extend({
  id: z.string(),
  userId: z.string(),
  state: z.enum(["Deck", "River", "Garden", "Stalled", "Active", "Completed"]),
  nanoSteps: z.array(NanoStepSchema).default([]),
  createdAt: z.date(),
  updatedAt: z.date(),
  deckOrder: z.number().optional(),
});

export const CreateTaskSchema = TaskSchema;

export const UpdateTaskSchema = TaskSchema.partial().extend({
  state: z
    .enum(["Deck", "River", "Garden", "Stalled", "Active", "Completed"])
    .optional(),
  nanoSteps: z.array(NanoStepSchema).optional(),
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;
export type Task = z.infer<typeof TaskResponseSchema>;
export type CreateTask = z.infer<typeof CreateTaskSchema>;
export type UpdateTask = z.infer<typeof UpdateTaskSchema>;
export type NanoStep = z.infer<typeof NanoStepSchema>;

export interface Timeline {
  id: string;
  userId: string;
  tasks: TimelineTask[];
  bufferDays: BufferDay[];
  stressClusters: StressCluster[];
  generatedAt: Date;
  lastModified: Date;
}

export interface TimelineTask {
  taskId: string;
  title: string;
  position: number;
  renderStyle: "clear" | "blurred" | "misty";
  scheduledDate: Date;
  dependencies: string[];
}

export interface BufferDay {
  date: Date;
  reason: string;
  isInserted: boolean;
}

export interface StressCluster {
  startDate: Date;
  endDate: Date;
  severity: "low" | "medium" | "high";
  taskCount: number;
}

export interface GardenState {
  userId: string;
  elements: GardenElement[];
  sunBrightness: number;
  currentStreak: number;
  longestStreak: number;
  totalFlowers: number;
  totalTrees: number;
  lastUpdated: Date;
}

export interface GardenElement {
  id: string;
  type: "flower" | "tree" | "sun";
  position: { x: number; y: number };
  size: number;
  color: string;
  taskId: string;
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  preferences: UserPreferences;
  gardenState: GardenState;
  createdAt: Date;
  updatedAt: Date;
}
