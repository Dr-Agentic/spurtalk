import { z } from "zod";
export declare const UserPreferencesSchema: z.ZodObject<{
    stallDetectionTimeout: z.ZodDefault<z.ZodNumber>;
    colorPalette: z.ZodDefault<z.ZodEnum<["default", "high_contrast"]>>;
    fuzzyDeadlineLabels: z.ZodObject<{
        soon: z.ZodDefault<z.ZodNumber>;
        thisWeek: z.ZodDefault<z.ZodNumber>;
        eventually: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        soon: number;
        thisWeek: number;
        eventually: number;
    }, {
        soon?: number | undefined;
        thisWeek?: number | undefined;
        eventually?: number | undefined;
    }>;
    notificationSettings: z.ZodObject<{
        taskReminders: z.ZodDefault<z.ZodBoolean>;
        stallDetection: z.ZodDefault<z.ZodBoolean>;
        milestoneCelebrations: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        taskReminders: boolean;
        stallDetection: boolean;
        milestoneCelebrations: boolean;
    }, {
        taskReminders?: boolean | undefined;
        stallDetection?: boolean | undefined;
        milestoneCelebrations?: boolean | undefined;
    }>;
    timezone: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    stallDetectionTimeout: number;
    colorPalette: "default" | "high_contrast";
    fuzzyDeadlineLabels: {
        soon: number;
        thisWeek: number;
        eventually: number;
    };
    notificationSettings: {
        taskReminders: boolean;
        stallDetection: boolean;
        milestoneCelebrations: boolean;
    };
    timezone: string;
}, {
    fuzzyDeadlineLabels: {
        soon?: number | undefined;
        thisWeek?: number | undefined;
        eventually?: number | undefined;
    };
    notificationSettings: {
        taskReminders?: boolean | undefined;
        stallDetection?: boolean | undefined;
        milestoneCelebrations?: boolean | undefined;
    };
    stallDetectionTimeout?: number | undefined;
    colorPalette?: "default" | "high_contrast" | undefined;
    timezone?: string | undefined;
}>;
export declare const TaskSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    effortLevel: z.ZodEnum<["Tiny", "Small", "Medium", "Big"]>;
    emotionalTag: z.ZodOptional<z.ZodEnum<["Boring", "Scary", "Fun"]>>;
    fuzzyDeadline: z.ZodEnum<["Soon", "This Week", "Eventually"]>;
    hardDeadline: z.ZodEffects<z.ZodUnion<[z.ZodString, z.ZodDate]>, Date, string | Date>;
    compellingEvent: z.ZodOptional<z.ZodString>;
    motivationCategory: z.ZodOptional<z.ZodEnum<["Relief", "Energy", "Achievement", "Identity"]>>;
    dependencies: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    deckOrder: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    title: string;
    effortLevel: "Tiny" | "Small" | "Medium" | "Big";
    fuzzyDeadline: "Soon" | "This Week" | "Eventually";
    hardDeadline: Date;
    dependencies: string[];
    tags: string[];
    description?: string | undefined;
    emotionalTag?: "Boring" | "Scary" | "Fun" | undefined;
    compellingEvent?: string | undefined;
    motivationCategory?: "Relief" | "Energy" | "Achievement" | "Identity" | undefined;
    deckOrder?: number | undefined;
}, {
    title: string;
    effortLevel: "Tiny" | "Small" | "Medium" | "Big";
    fuzzyDeadline: "Soon" | "This Week" | "Eventually";
    hardDeadline: string | Date;
    description?: string | undefined;
    emotionalTag?: "Boring" | "Scary" | "Fun" | undefined;
    compellingEvent?: string | undefined;
    motivationCategory?: "Relief" | "Energy" | "Achievement" | "Identity" | undefined;
    dependencies?: string[] | undefined;
    tags?: string[] | undefined;
    deckOrder?: number | undefined;
}>;
export declare const NanoStepSchema: z.ZodObject<{
    id: z.ZodString;
    text: z.ZodString;
    estimatedSeconds: z.ZodNumber;
    emotionalEffort: z.ZodEnum<["zero", "minimal"]>;
    isCompleted: z.ZodBoolean;
    parentTaskId: z.ZodString;
    generatedByAI: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    id: string;
    parentTaskId: string;
    text: string;
    estimatedSeconds: number;
    emotionalEffort: "zero" | "minimal";
    isCompleted: boolean;
    generatedByAI?: boolean | undefined;
}, {
    id: string;
    parentTaskId: string;
    text: string;
    estimatedSeconds: number;
    emotionalEffort: "zero" | "minimal";
    isCompleted: boolean;
    generatedByAI?: boolean | undefined;
}>;
export declare const TaskResponseSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    effortLevel: z.ZodEnum<["Tiny", "Small", "Medium", "Big"]>;
    emotionalTag: z.ZodOptional<z.ZodEnum<["Boring", "Scary", "Fun"]>>;
    fuzzyDeadline: z.ZodEnum<["Soon", "This Week", "Eventually"]>;
    hardDeadline: z.ZodEffects<z.ZodUnion<[z.ZodString, z.ZodDate]>, Date, string | Date>;
    compellingEvent: z.ZodOptional<z.ZodString>;
    motivationCategory: z.ZodOptional<z.ZodEnum<["Relief", "Energy", "Achievement", "Identity"]>>;
    dependencies: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
} & {
    id: z.ZodString;
    userId: z.ZodString;
    state: z.ZodEnum<["Deck", "River", "Garden", "Stalled", "Active", "Completed"]>;
    nanoSteps: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        text: z.ZodString;
        estimatedSeconds: z.ZodNumber;
        emotionalEffort: z.ZodEnum<["zero", "minimal"]>;
        isCompleted: z.ZodBoolean;
        parentTaskId: z.ZodString;
        generatedByAI: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        parentTaskId: string;
        text: string;
        estimatedSeconds: number;
        emotionalEffort: "zero" | "minimal";
        isCompleted: boolean;
        generatedByAI?: boolean | undefined;
    }, {
        id: string;
        parentTaskId: string;
        text: string;
        estimatedSeconds: number;
        emotionalEffort: "zero" | "minimal";
        isCompleted: boolean;
        generatedByAI?: boolean | undefined;
    }>, "many">>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
    deckOrder: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    userId: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    effortLevel: "Tiny" | "Small" | "Medium" | "Big";
    fuzzyDeadline: "Soon" | "This Week" | "Eventually";
    hardDeadline: Date;
    state: "Deck" | "River" | "Garden" | "Stalled" | "Active" | "Completed";
    nanoSteps: {
        id: string;
        parentTaskId: string;
        text: string;
        estimatedSeconds: number;
        emotionalEffort: "zero" | "minimal";
        isCompleted: boolean;
        generatedByAI?: boolean | undefined;
    }[];
    dependencies: string[];
    tags: string[];
    description?: string | undefined;
    emotionalTag?: "Boring" | "Scary" | "Fun" | undefined;
    compellingEvent?: string | undefined;
    motivationCategory?: "Relief" | "Energy" | "Achievement" | "Identity" | undefined;
    deckOrder?: number | undefined;
}, {
    userId: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    effortLevel: "Tiny" | "Small" | "Medium" | "Big";
    fuzzyDeadline: "Soon" | "This Week" | "Eventually";
    hardDeadline: string | Date;
    state: "Deck" | "River" | "Garden" | "Stalled" | "Active" | "Completed";
    description?: string | undefined;
    emotionalTag?: "Boring" | "Scary" | "Fun" | undefined;
    compellingEvent?: string | undefined;
    motivationCategory?: "Relief" | "Energy" | "Achievement" | "Identity" | undefined;
    nanoSteps?: {
        id: string;
        parentTaskId: string;
        text: string;
        estimatedSeconds: number;
        emotionalEffort: "zero" | "minimal";
        isCompleted: boolean;
        generatedByAI?: boolean | undefined;
    }[] | undefined;
    dependencies?: string[] | undefined;
    tags?: string[] | undefined;
    deckOrder?: number | undefined;
}>;
export declare const CreateTaskSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    effortLevel: z.ZodEnum<["Tiny", "Small", "Medium", "Big"]>;
    emotionalTag: z.ZodOptional<z.ZodEnum<["Boring", "Scary", "Fun"]>>;
    fuzzyDeadline: z.ZodEnum<["Soon", "This Week", "Eventually"]>;
    hardDeadline: z.ZodEffects<z.ZodUnion<[z.ZodString, z.ZodDate]>, Date, string | Date>;
    compellingEvent: z.ZodOptional<z.ZodString>;
    motivationCategory: z.ZodOptional<z.ZodEnum<["Relief", "Energy", "Achievement", "Identity"]>>;
    dependencies: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    deckOrder: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    title: string;
    effortLevel: "Tiny" | "Small" | "Medium" | "Big";
    fuzzyDeadline: "Soon" | "This Week" | "Eventually";
    hardDeadline: Date;
    dependencies: string[];
    tags: string[];
    description?: string | undefined;
    emotionalTag?: "Boring" | "Scary" | "Fun" | undefined;
    compellingEvent?: string | undefined;
    motivationCategory?: "Relief" | "Energy" | "Achievement" | "Identity" | undefined;
    deckOrder?: number | undefined;
}, {
    title: string;
    effortLevel: "Tiny" | "Small" | "Medium" | "Big";
    fuzzyDeadline: "Soon" | "This Week" | "Eventually";
    hardDeadline: string | Date;
    description?: string | undefined;
    emotionalTag?: "Boring" | "Scary" | "Fun" | undefined;
    compellingEvent?: string | undefined;
    motivationCategory?: "Relief" | "Energy" | "Achievement" | "Identity" | undefined;
    dependencies?: string[] | undefined;
    tags?: string[] | undefined;
    deckOrder?: number | undefined;
}>;
export declare const UpdateTaskSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    effortLevel: z.ZodOptional<z.ZodEnum<["Tiny", "Small", "Medium", "Big"]>>;
    emotionalTag: z.ZodOptional<z.ZodOptional<z.ZodEnum<["Boring", "Scary", "Fun"]>>>;
    fuzzyDeadline: z.ZodOptional<z.ZodEnum<["Soon", "This Week", "Eventually"]>>;
    hardDeadline: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodString, z.ZodDate]>, Date, string | Date>>;
    compellingEvent: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    motivationCategory: z.ZodOptional<z.ZodOptional<z.ZodEnum<["Relief", "Energy", "Achievement", "Identity"]>>>;
    dependencies: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString, "many">>>;
    tags: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString, "many">>>;
    deckOrder: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
} & {
    state: z.ZodOptional<z.ZodEnum<["Deck", "River", "Garden", "Stalled", "Active", "Completed"]>>;
    nanoSteps: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        text: z.ZodString;
        estimatedSeconds: z.ZodNumber;
        emotionalEffort: z.ZodEnum<["zero", "minimal"]>;
        isCompleted: z.ZodBoolean;
        parentTaskId: z.ZodString;
        generatedByAI: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        parentTaskId: string;
        text: string;
        estimatedSeconds: number;
        emotionalEffort: "zero" | "minimal";
        isCompleted: boolean;
        generatedByAI?: boolean | undefined;
    }, {
        id: string;
        parentTaskId: string;
        text: string;
        estimatedSeconds: number;
        emotionalEffort: "zero" | "minimal";
        isCompleted: boolean;
        generatedByAI?: boolean | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    description?: string | undefined;
    effortLevel?: "Tiny" | "Small" | "Medium" | "Big" | undefined;
    emotionalTag?: "Boring" | "Scary" | "Fun" | undefined;
    fuzzyDeadline?: "Soon" | "This Week" | "Eventually" | undefined;
    hardDeadline?: Date | undefined;
    compellingEvent?: string | undefined;
    motivationCategory?: "Relief" | "Energy" | "Achievement" | "Identity" | undefined;
    state?: "Deck" | "River" | "Garden" | "Stalled" | "Active" | "Completed" | undefined;
    nanoSteps?: {
        id: string;
        parentTaskId: string;
        text: string;
        estimatedSeconds: number;
        emotionalEffort: "zero" | "minimal";
        isCompleted: boolean;
        generatedByAI?: boolean | undefined;
    }[] | undefined;
    dependencies?: string[] | undefined;
    tags?: string[] | undefined;
    deckOrder?: number | undefined;
}, {
    title?: string | undefined;
    description?: string | undefined;
    effortLevel?: "Tiny" | "Small" | "Medium" | "Big" | undefined;
    emotionalTag?: "Boring" | "Scary" | "Fun" | undefined;
    fuzzyDeadline?: "Soon" | "This Week" | "Eventually" | undefined;
    hardDeadline?: string | Date | undefined;
    compellingEvent?: string | undefined;
    motivationCategory?: "Relief" | "Energy" | "Achievement" | "Identity" | undefined;
    state?: "Deck" | "River" | "Garden" | "Stalled" | "Active" | "Completed" | undefined;
    nanoSteps?: {
        id: string;
        parentTaskId: string;
        text: string;
        estimatedSeconds: number;
        emotionalEffort: "zero" | "minimal";
        isCompleted: boolean;
        generatedByAI?: boolean | undefined;
    }[] | undefined;
    dependencies?: string[] | undefined;
    tags?: string[] | undefined;
    deckOrder?: number | undefined;
}>;
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