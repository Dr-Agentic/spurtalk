export interface Card {
  id: string;
  effort: "Tiny" | "Small" | "Medium" | "Large" | "Huge";
  deadline: string;
  fuzzyDeadline: boolean;
  tags: string[];
  parentId: string | null;
  childIds: string[];
  status:
    | "Backlog"
    | "Ready"
    | "InProgress"
    | "Completed"
    | "Stuck"
    | "Deleted";
  completedAt: string | null;
  deletedAt: string | null;
  dependencies: string[];
}

export interface CardInput {
  id?: string;
  effort?: "Tiny" | "Small" | "Medium" | "Large" | "Huge";
  deadline?: string;
  fuzzyDeadline?: boolean;
  tags?: string[];
  title?: string;
  description?: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

export interface ParentTask extends Card {
  // Additional fields specific to parent tasks can be added here
}

export interface NanoStep extends ChecklistItem {
  // NanoStep inherits from ChecklistItem
}

export type EmotionTag = "Scary" | "Joyful" | "Calm" | "Sad";
/**
 * Card lifecycle state types
 */
export type CardLifecycleState =
  | "initial"
  | "loading"
  | "active"
  | "completed"
  | "discarded";
