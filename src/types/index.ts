export interface Task {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
  isCompleted: boolean;
}

export interface MicroStep {
  id: string;
  title: string;
  description?: string;
  estimatedTime: number; // in minutes
  isCompleted: boolean;
  createdAt: Date;
}

export interface TaskBreakdown {
  taskId: string;
  originalTask: string;
  microSteps: MicroStep[];
  createdAt: Date;
  isAccepted: boolean;
}

export interface AppState {
  tasks: Task[];
  breakdowns: TaskBreakdown[];
  currentStep: string | null; // ID of the current step being worked on
}