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
  contextSnapshots: ContextSnapshot[];
  workSessions: WorkSession[];
  emotionStates: EmotionState[];
  taskEnergyRequirements: TaskEnergyRequirement[];
  reminders: Reminder[];
  reminderSettings: ReminderSettings;
  snoozeReasons: SnoozeReason[];
  reminderPatterns: ReminderPattern[];
  emergencyMode: EmergencyMode;
  emergencyAssessments: EmergencyAssessment[];
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

export interface EmotionState {
  id: string;
  emotion: 'energized' | 'anxious' | 'creative' | 'brain-dead' | 'focused' | 'tired' | 'motivated' | 'overwhelmed';
  intensity: number; // 1-10
  timestamp: Date;
  tasksCompleted: string[]; // task IDs completed in this state
}

export interface TaskEnergyRequirement {
  taskId: string;
  energyLevel: 'low' | 'medium' | 'high';
  focusType: 'creative' | 'analytical' | 'routine' | 'mental' | 'physical';
  estimatedTime: number; // in minutes
}

export interface SmartTaskFilter {
  currentEmotion: EmotionState | null;
  matchingTasks: Task[];
  suggestedAlternatives: Task[];
  energyOptimization: string;
}

export interface ContextSnapshot {
  id: string;
  taskId: string;
  stepId: string | null;
  timestamp: Date;
  contextNotes: string;
  locationData: string; // URL, document position, etc.
  nextActionSuggestion: string;
  relatedTasks: string[];
}

export interface WorkSession {
  id: string;
  taskId: string;
  startTime: Date;
  endTime: Date | null;
  contextSnapshots: ContextSnapshot[];
  totalDuration: number; // in milliseconds
  interruptionCount: number;
  finalContext: string;
}

export interface Reminder {
  id: string;
  taskId: string;
  title: string;
  message: string;
  tone: 'encouraging' | 'neutral' | 'humorous';
  scheduledTime: Date;
  isSnoozed: boolean;
  snoozeReason?: string;
  snoozeCount: number;
  lastSnoozeTime: Date | null;
  isCompleted: boolean;
  completedAt: Date | null;
  createdAt: Date;
}

export interface ReminderSettings {
  enabled: boolean;
  tone: 'encouraging' | 'neutral' | 'humorous';
  maxSnoozes: number;
  snoozeDuration: number; // in minutes
  smartTiming: boolean;
  spamProtection: boolean;
  celebrationEnabled: boolean;
}

export interface SnoozeReason {
  id: string;
  reason: string;
  frequency: number;
  suggestedAlternatives: string[];
}

export interface ReminderPattern {
  taskId: string;
  snoozeHistory: Array<{
    reason: string;
    timestamp: Date;
    duration: number;
  }>;
  optimalTiming: {
    timeOfDay: number; // 0-23
    dayOfWeek: number; // 0-6
    energyLevel: 'low' | 'medium' | 'high';
  };
  completionRate: number;
}

export interface EmergencyMode {
  isActive: boolean;
  activatedAt: Date | null;
  deadline: Date | null;
  essentialTasks: string[]; // task IDs
  timeBoxingEnabled: boolean;
  timeBoxingDuration: number; // in minutes
  enforcedBreaks: boolean;
  breakDuration: number; // in minutes
  reflectionPrompt: string;
}

export interface EmergencyAssessment {
  id: string;
  assessmentTime: Date;
  deadline: Date;
  totalTasks: number;
  essentialTaskCount: number;
  essentialTasks: string[]; // task IDs
  cuttableTasks: number;
  timeAvailable: number; // in minutes
  recommendations: string[];
  triageDecision: 'urgent' | 'important' | 'can_wait' | 'not_needed';
}