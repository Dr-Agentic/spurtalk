import { z } from "zod";

// Export types from types.d.ts
export type {
  Card,
  CardInput,
  ChecklistItem,
  ParentTask,
  EmotionTag,
  CardLifecycleState,
} from "./types";

export const UserPreferencesSchema = z
  .object({
    stallDetectionTimeout: z.number().min(1).max(168).default(24),
    colorPalette: z.enum(["default", "high_contrast"]).default("default"),
    fuzzyDeadlineLabels: z
      .object({
        soon: z.number().default(2),
        thisWeek: z.number().default(7),
        eventually: z.number().default(30),
      })
      .default({
        soon: 2,
        thisWeek: 7,
        eventually: 30,
      }),
    notificationSettings: z
      .object({
        taskReminders: z.boolean().default(true),
        stallDetection: z.boolean().default(true),
        milestoneCelebrations: z.boolean().default(true),
      })
      .default({
        taskReminders: true,
        stallDetection: true,
        milestoneCelebrations: true,
      }),
    timezone: z.string().default("UTC"),
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

export const TaskSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.string().optional(),
  effortLevel: z.enum(["Tiny", "Small", "Medium", "Big"]),
  emotionalTag: z.enum(["Boring", "Scary", "Fun", "Hard"]).optional(),
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
  parentTaskId: z.string().optional(),
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

export type Task = z.infer<typeof TaskSchema> & {
  id: string;
  userId: string;
  state:
  | "Deck"
  | "River"
  | "Garden"
  | "Stalled"
  | "Active"
  | "Completed"
  | "Tracking";
  nanoSteps: NanoStep[];
  subtasks?: Task[];
  parentTask?: Task;
  createdAt: Date;
  updatedAt: Date;
  deckOrder?: number;
};

export const TaskResponseSchema: z.ZodType<Task> = TaskSchema.extend({
  id: z.string(),
  userId: z.string(),
  state: z.enum([
    "Deck",
    "River",
    "Garden",
    "Stalled",
    "Active",
    "Completed",
    "Tracking",
  ]),
  nanoSteps: z.array(NanoStepSchema).default([]),
  subtasks: z.array(z.lazy(() => TaskResponseSchema)).optional(),
  parentTask: z.lazy(() => TaskResponseSchema).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deckOrder: z.number().optional(),
}) as z.ZodType<Task>;

export const CreateTaskSchema = z
  .object({
    title: z
      .string()
      .min(1, "Give your card a title")
      .max(
        500,
        "Keep the title under 500 characters - you can add more details in the description"
      ),
    description: z
      .string()
      .max(
        2000,
        "Description is a bit long - try keeping it under 2000 characters"
      )
      .optional(),
    effortLevel: z.enum(["Tiny", "Small", "Medium", "Big"], {
      message: "Let us know how big this feels",
    }),
    emotionalTag: z.enum(["Boring", "Scary", "Fun", "Hard"]).optional(),
    fuzzyDeadline: z.enum(["Soon", "This Week", "Eventually"]).optional(),
    hardDeadline: z
      .string()
      .or(z.date())
      .transform((val) => new Date(val))
      .optional(),
    tags: z
      .union([
        z.array(z.string()),
        z.string().transform((val) => val.split(",").map((t) => t.trim())),
      ])
      .default([]),
  })
  .extend({
    dependencies: z.array(z.string()).optional(),
    compellingEvent: z.string().optional(),
    motivationCategory: z
      .enum(["Relief", "Energy", "Achievement", "Identity"])
      .optional(),
    parentTaskId: z.string().optional(),
  })
  .refine((data) => !(data.fuzzyDeadline && data.hardDeadline), {
    message: "Choose either a flexible timeframe or a specific date - not both",
    path: ["fuzzyDeadline"],
  })
  .refine((data) => !data.hardDeadline || data.hardDeadline > new Date(), {
    message:
      "Pick a date in the future so you have time to work on it",
    path: ["hardDeadline"],
  });

export const UpdateTaskSchema = TaskSchema.partial().extend({
  state: z
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
  nanoSteps: z.array(NanoStepSchema).optional(),
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;
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
  effortLevel: "Tiny" | "Small" | "Medium" | "Big";
  emotionalTag?: "Boring" | "Scary" | "Fun" | "Hard";
  nanoSteps: NanoStep[];
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
