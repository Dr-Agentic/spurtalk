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

export interface TimerState {
  isActive: boolean;
  startTime: Date | null;
  duration: number; // in milliseconds
  currentTaskId: string | null;
  currentStepId: string | null;
}

export interface ProgressState {
  totalStepsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  achievements: Achievement[];
  dailyStats: DailyStats[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  isUnlocked: boolean;
}

export interface DailyStats {
  date: string; // YYYY-MM-DD format
  stepsCompleted: number;
  timeSpent: number; // in milliseconds
  tasksStarted: string[]; // task IDs
}

export interface ProcrastinationPattern {
  id: string;
  patternType: 'time_of_day' | 'task_type' | 'mood_based' | 'deadline_procrastination';
  description: string;
  frequency: number; // how often this pattern occurs
  lastObserved: Date;
  suggestions: string[];
  isActionable: boolean;
}

export interface ProcrastinationInsight {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  patterns: ProcrastinationPattern[];
  actionableSuggestions: string[];
  isWeeklyReport: boolean;
}

export interface AppState {
  tasks: Task[];
  breakdowns: TaskBreakdown[];
  currentStep: string | null; // ID of the current step being worked on
  timer: TimerState;
  progress: ProgressState;
  isPerfectionismMode: boolean;
  procrastinationInsights: ProcrastinationInsight[];
  procrastinationData: ProcrastinationData;
}

export interface ProcrastinationData {
  taskDelayHistory: TaskDelayRecord[];
  timeOfDayPatterns: TimeOfDayPattern[];
  emotionalTriggers: EmotionalTrigger[];
  taskTypePatterns: TaskTypePattern[];
  deadlinePatterns: DeadlinePattern[];
}

export interface TaskDelayRecord {
  taskId: string;
  taskTitle: string;
  createdDate: Date;
  firstActionDate: Date | null;
  delayHours: number | null;
  taskType?: string;
  emotionalState?: string;
}

export interface TimeOfDayPattern {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  hourOfDay: number; // 0-23
  taskCompletionRate: number;
  procrastinationRate: number;
  averageDelayHours: number;
}

export interface EmotionalTrigger {
  emotion: string; // 'anxious', 'overwhelmed', 'tired', 'bored', etc.
  tasksAffected: string[];
  averageDelayHours: number;
  copingMechanism: string;
}

export interface TaskTypePattern {
  taskType: string; // 'creative', 'administrative', 'learning', 'routine', etc.
  procrastinationScore: number; // 0-100
  averageDelayHours: number;
  completionRate: number;
  triggers: string[];
}

export interface DeadlinePattern {
  daysUntilDeadline: number;
  completionRate: number;
  procrastinationIntensity: number; // 0-100
  commonExcuses: string[];
}