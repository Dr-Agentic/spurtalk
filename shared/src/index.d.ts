import { z } from "zod";
export type { Card, CardInput, ChecklistItem, ParentTask, EmotionTag, CardLifecycleState, } from "./types";
export declare const UserPreferencesSchema: z.ZodDefault<z.ZodObject<{
    stallDetectionTimeout: z.ZodDefault<z.ZodNumber>;
    colorPalette: z.ZodDefault<z.ZodEnum<{
        default: "default";
        high_contrast: "high_contrast";
    }>>;
    fuzzyDeadlineLabels: z.ZodDefault<z.ZodObject<{
        soon: z.ZodDefault<z.ZodNumber>;
        thisWeek: z.ZodDefault<z.ZodNumber>;
        eventually: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>>;
    notificationSettings: z.ZodDefault<z.ZodObject<{
        taskReminders: z.ZodDefault<z.ZodBoolean>;
        stallDetection: z.ZodDefault<z.ZodBoolean>;
        milestoneCelebrations: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>>;
    timezone: z.ZodDefault<z.ZodString>;
}, z.core.$strip>>;
export declare const TaskSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    effortLevel: z.ZodEnum<{
        Small: "Small";
        Tiny: "Tiny";
        Medium: "Medium";
        Big: "Big";
    }>;
    emotionalTag: z.ZodOptional<z.ZodEnum<{
        Fun: "Fun";
        Boring: "Boring";
        Scary: "Scary";
        Hard: "Hard";
    }>>;
    fuzzyDeadline: z.ZodEnum<{
        Soon: "Soon";
        "This Week": "This Week";
        Eventually: "Eventually";
    }>;
    hardDeadline: z.ZodPipe<z.ZodUnion<[z.ZodString, z.ZodDate]>, z.ZodTransform<Date, string | Date>>;
    compellingEvent: z.ZodOptional<z.ZodString>;
    motivationCategory: z.ZodOptional<z.ZodEnum<{
        Achievement: "Achievement";
        Relief: "Relief";
        Energy: "Energy";
        Identity: "Identity";
    }>>;
    dependencies: z.ZodDefault<z.ZodArray<z.ZodString>>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString>>;
    deckOrder: z.ZodOptional<z.ZodNumber>;
    parentTaskId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const NanoStepSchema: z.ZodObject<{
    id: z.ZodString;
    text: z.ZodString;
    estimatedSeconds: z.ZodNumber;
    emotionalEffort: z.ZodEnum<{
        zero: "zero";
        minimal: "minimal";
    }>;
    isCompleted: z.ZodBoolean;
    parentTaskId: z.ZodString;
    generatedByAI: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type Task = z.infer<typeof TaskSchema> & {
    id: string;
    userId: string;
    state: "Deck" | "River" | "Garden" | "Stalled" | "Active" | "Completed" | "Tracking";
    nanoSteps: NanoStep[];
    subtasks?: Task[];
    parentTask?: Task;
    createdAt: Date;
    updatedAt: Date;
    deckOrder?: number;
};
export declare const TaskResponseSchema: z.ZodType<Task>;
export declare const CreateTaskSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    effortLevel: z.ZodEnum<{
        Small: "Small";
        Tiny: "Tiny";
        Medium: "Medium";
        Big: "Big";
    }>;
    emotionalTag: z.ZodOptional<z.ZodEnum<{
        Fun: "Fun";
        Boring: "Boring";
        Scary: "Scary";
        Hard: "Hard";
    }>>;
    fuzzyDeadline: z.ZodOptional<z.ZodEnum<{
        Soon: "Soon";
        "This Week": "This Week";
        Eventually: "Eventually";
    }>>;
    hardDeadline: z.ZodOptional<z.ZodPipe<z.ZodUnion<[z.ZodString, z.ZodDate]>, z.ZodTransform<Date, string | Date>>>;
    tags: z.ZodDefault<z.ZodUnion<readonly [z.ZodArray<z.ZodString>, z.ZodPipe<z.ZodString, z.ZodTransform<string[], string>>]>>;
    dependencies: z.ZodOptional<z.ZodArray<z.ZodString>>;
    compellingEvent: z.ZodOptional<z.ZodString>;
    motivationCategory: z.ZodOptional<z.ZodEnum<{
        Achievement: "Achievement";
        Relief: "Relief";
        Energy: "Energy";
        Identity: "Identity";
    }>>;
    parentTaskId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const UpdateTaskSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    effortLevel: z.ZodOptional<z.ZodEnum<{
        Small: "Small";
        Tiny: "Tiny";
        Medium: "Medium";
        Big: "Big";
    }>>;
    emotionalTag: z.ZodOptional<z.ZodOptional<z.ZodEnum<{
        Fun: "Fun";
        Boring: "Boring";
        Scary: "Scary";
        Hard: "Hard";
    }>>>;
    fuzzyDeadline: z.ZodOptional<z.ZodEnum<{
        Soon: "Soon";
        "This Week": "This Week";
        Eventually: "Eventually";
    }>>;
    hardDeadline: z.ZodOptional<z.ZodPipe<z.ZodUnion<[z.ZodString, z.ZodDate]>, z.ZodTransform<Date, string | Date>>>;
    compellingEvent: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    motivationCategory: z.ZodOptional<z.ZodOptional<z.ZodEnum<{
        Achievement: "Achievement";
        Relief: "Relief";
        Energy: "Energy";
        Identity: "Identity";
    }>>>;
    dependencies: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString>>>;
    tags: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString>>>;
    deckOrder: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    parentTaskId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    state: z.ZodOptional<z.ZodEnum<{
        Completed: "Completed";
        Deck: "Deck";
        River: "River";
        Garden: "Garden";
        Stalled: "Stalled";
        Active: "Active";
        Tracking: "Tracking";
    }>>;
    nanoSteps: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        text: z.ZodString;
        estimatedSeconds: z.ZodNumber;
        emotionalEffort: z.ZodEnum<{
            zero: "zero";
            minimal: "minimal";
        }>;
        isCompleted: z.ZodBoolean;
        parentTaskId: z.ZodString;
        generatedByAI: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
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
    position: {
        x: number;
        y: number;
    };
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
//# sourceMappingURL=index.d.ts.map