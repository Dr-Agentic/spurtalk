import { useState, useEffect } from 'react';
import { AppState, Task, MicroStep, TaskBreakdown, ProgressState, Achievement, ContextSnapshot, WorkSession, EmotionState, TaskEnergyRequirement, EmergencyAssessment } from '../types';
import { generateMicroSteps, simulateAiResponse } from '../utils/taskBreakdown';
import { ProcrastinationInsights } from '../utils/procrastinationInsights';
import { ReminderManager, defaultReminderSettings } from '../utils/reminderUtils';

export function useAppState() {
  const [state, setState] = useState<AppState>(() => {
    // Initialize from localStorage or defaults
    const saved = localStorage.getItem('spurtalk-state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Convert string dates back to Date objects
        return {
          ...parsed,
          tasks: parsed.tasks.map((task: any) => ({
            ...task,
            createdAt: new Date(task.createdAt)
          })),
          breakdowns: parsed.breakdowns.map((breakdown: any) => ({
            ...breakdown,
            createdAt: new Date(breakdown.createdAt),
            microSteps: breakdown.microSteps.map((step: any) => ({
              ...step,
              createdAt: new Date(step.createdAt)
            }))
          })),
          progress: parsed.progress || {
            totalStepsCompleted: 0,
            currentStreak: 0,
            longestStreak: 0,
            lastActiveDate: null,
            achievements: [],
            dailyStats: []
          },
          timer: parsed.timer || {
            isActive: false,
            startTime: null,
            duration: 0,
            currentTaskId: null,
            currentStepId: null
          },
          isPerfectionismMode: parsed.isPerfectionismMode ?? false,
          procrastinationInsights: parsed.procrastinationInsights || [],
          procrastinationData: parsed.procrastinationData || {
            taskDelayHistory: [],
            timeOfDayPatterns: [],
            emotionalTriggers: [],
            taskTypePatterns: [],
            deadlinePatterns: []
          },
          contextSnapshots: parsed.contextSnapshots || [],
          workSessions: parsed.workSessions || [],
          emotionStates: parsed.emotionStates || [],
          taskEnergyRequirements: parsed.taskEnergyRequirements || [],
          reminders: parsed.reminders || [],
          reminderSettings: parsed.reminderSettings || defaultReminderSettings,
          snoozeReasons: parsed.snoozeReasons || [],
          reminderPatterns: parsed.reminderPatterns || [],
          emergencyMode: parsed.emergencyMode || {
            isActive: false,
            activatedAt: null,
            deadline: null,
            essentialTasks: [],
            timeBoxingEnabled: true,
            timeBoxingDuration: 25, // 25 minutes default
            enforcedBreaks: true,
            breakDuration: 5, // 5 minutes default
            reflectionPrompt: "What did you accomplish? What could prevent this next time?"
          },
          emergencyAssessments: parsed.emergencyAssessments || []
        };
      } catch (e) {
        console.warn('Failed to parse saved state, using defaults');
      }
    }
    return {
      tasks: [],
      breakdowns: [],
      currentStep: null,
      progress: {
        totalStepsCompleted: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastActiveDate: null,
        achievements: [],
        dailyStats: []
      },
      timer: {
        isActive: false,
        startTime: null,
        duration: 0,
        currentTaskId: null,
        currentStepId: null
      },
      isPerfectionismMode: false,
      procrastinationInsights: [],
      procrastinationData: {
        taskDelayHistory: [],
        timeOfDayPatterns: [],
        emotionalTriggers: [],
        taskTypePatterns: [],
        deadlinePatterns: []
      },
      contextSnapshots: [],
      workSessions: [],
      emotionStates: [],
      taskEnergyRequirements: [],
      reminders: [],
      reminderSettings: defaultReminderSettings,
      snoozeReasons: [],
      reminderPatterns: [],
      emergencyMode: {
        isActive: false,
        activatedAt: null,
        deadline: null,
        essentialTasks: [],
        timeBoxingEnabled: true,
        timeBoxingDuration: 25, // 25 minutes default
        enforcedBreaks: true,
        breakDuration: 5, // 5 minutes default
        reflectionPrompt: "What did you accomplish? What could prevent this next time?"
      },
      emergencyAssessments: []
    };
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('spurtalk-state', JSON.stringify(state));
  }, [state]);

  const addTask = (title: string, description?: string) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title,
      description,
      createdAt: new Date(),
      isCompleted: false
    };

    setState(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTask]
    }));
  };

  const trackProcrastinationPattern = (taskId: string, emotionalState?: string) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;

    // Use procrastination insights to track delay
    const insights = new ProcrastinationInsights(state.procrastinationData);
    insights.trackTaskDelay(task, emotionalState);

    setState(prev => ({
      ...prev,
      procrastinationData: insights.data
    }));
  };

  const markTaskStarted = (taskId: string, emotionalState?: string) => {
    const insights = new ProcrastinationInsights(state.procrastinationData);
    insights.markTaskStarted(taskId, emotionalState);

    setState(prev => ({
      ...prev,
      procrastinationData: insights.data
    }));
  };

  const generateInsights = (): any[] => {
    const insights = new ProcrastinationInsights(state.procrastinationData);
    const generatedInsights = insights.generateInsights();

    // Update state with new insights
    setState(prev => ({
      ...prev,
      procrastinationInsights: generatedInsights
    }));

    return generatedInsights;
  };

  // Context Preservation Functions
  const createContextSnapshot = (taskId: string, stepId: string | null, contextNotes: string, locationData: string) => {
    const snapshot: ContextSnapshot = {
      id: `snapshot-${Date.now()}`,
      taskId,
      stepId,
      timestamp: new Date(),
      contextNotes,
      locationData,
      nextActionSuggestion: stepId ? "Continue with current step" : "Start with first step",
      relatedTasks: []
    };

    setState(prev => ({
      ...prev,
      contextSnapshots: [...prev.contextSnapshots, snapshot]
    }));
  };

  const addContextNote = (taskId: string, stepId: string | null, note: string) => {
    createContextSnapshot(taskId, stepId, note, window.location.href);
  };

  const getPreviousContext = (taskId: string): ContextSnapshot | null => {
    const snapshots = state.contextSnapshots
      .filter(s => s.taskId === taskId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return snapshots.length > 0 ? snapshots[0] : null;
  };

  const getTimelineView = (taskId: string): ContextSnapshot[] => {
    return state.contextSnapshots
      .filter(s => s.taskId === taskId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  const startWorkSession = (taskId: string) => {
    const session: WorkSession = {
      id: `session-${Date.now()}`,
      taskId,
      startTime: new Date(),
      endTime: null,
      contextSnapshots: [],
      totalDuration: 0,
      interruptionCount: 0,
      finalContext: ""
    };

    setState(prev => ({
      ...prev,
      workSessions: [...prev.workSessions, session]
    }));
  };

  const endWorkSession = (sessionId: string, finalContext: string) => {
    setState(prev => ({
      ...prev,
      workSessions: prev.workSessions.map(session =>
        session.id === sessionId
          ? {
              ...session,
              endTime: new Date(),
              finalContext,
              totalDuration: session.endTime
                ? session.endTime.getTime() - session.startTime.getTime()
                : Date.now() - session.startTime.getTime()
            }
          : session
      )
    }));
  };

  const getCurrentSession = (taskId: string): WorkSession | null => {
    const session = state.workSessions
      .filter(s => s.taskId === taskId && s.endTime === null)
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime());

    return session.length > 0 ? session[0] : null;
  };

  const deleteTask = (taskId: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(task => task.id !== taskId),
      breakdowns: prev.breakdowns.filter(breakdown => breakdown.taskId !== taskId)
    }));
  };

  const generateBreakdown = async (taskId: string) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;

    // Simulate AI processing
    await simulateAiResponse();

    const microSteps = generateMicroSteps(task.title);
    const newBreakdown: TaskBreakdown = {
      taskId,
      originalTask: task.title,
      microSteps,
      createdAt: new Date(),
      isAccepted: false
    };

    setState(prev => ({
      ...prev,
      breakdowns: [...prev.breakdowns, newBreakdown]
    }));
  };

  const acceptBreakdown = (breakdownId: string) => {
    setState(prev => ({
      ...prev,
      breakdowns: prev.breakdowns.map(breakdown =>
        breakdown.taskId === breakdownId
          ? { ...breakdown, isAccepted: true }
          : breakdown
      )
    }));
  };

  const rejectBreakdown = (breakdownId: string) => {
    setState(prev => ({
      ...prev,
      breakdowns: prev.breakdowns.filter(b => b.taskId !== breakdownId)
    }));
  };

  const modifyBreakdown = (breakdownId: string, newSteps: MicroStep[]) => {
    setState(prev => ({
      ...prev,
      breakdowns: prev.breakdowns.map(breakdown =>
        breakdown.taskId === breakdownId
          ? { ...breakdown, microSteps: newSteps }
          : breakdown
      )
    }));
  };

  const toggleStepCompletion = (breakdownId: string, stepId: string) => {
    setState(prev => {
      const newState = {
        ...prev,
        breakdowns: prev.breakdowns.map(breakdown =>
          breakdown.taskId === breakdownId
            ? {
                ...breakdown,
                microSteps: breakdown.microSteps.map(step =>
                  step.id === stepId
                    ? { ...step, isCompleted: !step.isCompleted }
                    : step
                )
              }
            : breakdown
        )
      };

      // Update progress tracking
      const completedSteps = newState.breakdowns
        .flatMap(b => b.microSteps)
        .filter(step => step.isCompleted).length;

      // Track task completion if this is the first step completed
      const step = newState.breakdowns
        .flatMap(b => b.microSteps)
        .find(s => s.id === stepId);

      if (step && !step.isCompleted) {
        // This is now completed, so mark task as started
        const task = newState.tasks.find(t => t.id === breakdownId);
        if (task) {
          // Mark task as started in procrastination data
          const insights = new ProcrastinationInsights(newState.procrastinationData);
          insights.markTaskStarted(task.id);
          newState.procrastinationData = insights.data;
        }
      }

      return {
        ...newState,
        progress: updateProgressState(newState.progress, completedSteps)
      };
    });
  };

  const getCurrentBreakdown = (taskId: string) => {
    return state.breakdowns.find(b => b.taskId === taskId);
  };

  const startTwoMinuteTimer = (taskId: string, stepId?: string) => {
    const now = new Date();
    setState(prev => ({
      ...prev,
      timer: {
        isActive: true,
        startTime: now,
        duration: 2 * 60 * 1000, // 2 minutes in milliseconds
        currentTaskId: taskId,
        currentStepId: stepId || null
      }
    }));
  };

  const stopTimer = () => {
    setState(prev => ({
      ...prev,
      timer: {
        ...prev.timer,
        isActive: false,
        startTime: null
      }
    }));
  };

  const pauseTimer = () => {
    setState(prev => ({
      ...prev,
      timer: {
        ...prev.timer,
        isActive: false
      }
    }));
  };

  const resumeTimer = () => {
    if (state.timer.currentTaskId) {
      setState(prev => ({
        ...prev,
        timer: {
          ...prev.timer,
          isActive: true,
          startTime: new Date()
        }
      }));
    }
  };

  const getTimerProgress = () => {
    if (!state.timer.isActive || !state.timer.startTime) return 0;

    const elapsed = Date.now() - state.timer.startTime.getTime();
    const progress = Math.min(elapsed / state.timer.duration, 1);
    return progress;
  };

  const getRemainingTime = () => {
    if (!state.timer.startTime) return state.timer.duration;

    const elapsed = Date.now() - state.timer.startTime.getTime();
    const remaining = Math.max(0, state.timer.duration - elapsed);
    return remaining;
  };

  const isTimerFinished = () => {
    return getRemainingTime() === 0;
  };

  const resetTimer = () => {
    setState(prev => ({
      ...prev,
      timer: {
        isActive: false,
        startTime: null,
        duration: 0,
        currentTaskId: null,
        currentStepId: null
      }
    }));
  };

  const togglePerfectionismMode = () => {
    setState(prev => ({
      ...prev,
      isPerfectionismMode: !prev.isPerfectionismMode
    }));
  };

  // Emotion Tracking Functions
  const setCurrentEmotion = (emotion: 'energized' | 'anxious' | 'creative' | 'brain-dead' | 'focused' | 'tired' | 'motivated' | 'overwhelmed', intensity: number) => {
    const emotionState: EmotionState = {
      id: `emotion-${Date.now()}`,
      emotion,
      intensity,
      timestamp: new Date(),
      tasksCompleted: []
    };

    setState(prev => ({
      ...prev,
      emotionStates: [...prev.emotionStates, emotionState]
    }));
  };

  const getCurrentEmotion = (): EmotionState | null => {
    const emotions = state.emotionStates
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return emotions.length > 0 ? emotions[0] : null;
  };

  const setTaskEnergyRequirement = (taskId: string, energyLevel: 'low' | 'medium' | 'high', focusType: 'creative' | 'analytical' | 'routine' | 'mental' | 'physical', estimatedTime: number) => {
    const existingIndex = state.taskEnergyRequirements.findIndex(req => req.taskId === taskId);

    const newRequirement: TaskEnergyRequirement = {
      taskId,
      energyLevel,
      focusType,
      estimatedTime
    };

    setState(prev => ({
      ...prev,
      taskEnergyRequirements: existingIndex >= 0
        ? prev.taskEnergyRequirements.map((req, index) =>
            index === existingIndex ? newRequirement : req
          )
        : [...prev.taskEnergyRequirements, newRequirement]
    }));
  };

  const getTaskEnergyRequirement = (taskId: string): TaskEnergyRequirement | null => {
    return state.taskEnergyRequirements.find(req => req.taskId === taskId) || null;
  };

  const getSmartTaskFilter = (): any => {
    const currentEmotion = getCurrentEmotion();
    const tasks = [...state.tasks];

    if (!currentEmotion) {
      return {
        currentEmotion: null,
        matchingTasks: tasks,
        suggestedAlternatives: [],
        energyOptimization: "Set your current emotion to get personalized task suggestions"
      };
    }

    // Filter tasks based on current emotion and energy requirements
    const matchingTasks = tasks.filter(task => {
      const requirement = getTaskEnergyRequirement(task.id);
      if (!requirement) return true; // If no requirement set, show task

      // Energy level matching
      const energyMatch = requirement.energyLevel === 'low' ||
                         (requirement.energyLevel === 'medium' && currentEmotion.intensity >= 4) ||
                         (requirement.energyLevel === 'high' && currentEmotion.intensity >= 7);

      // Focus type matching
      const focusMatch = requirement.focusType === 'routine' ||
                        (requirement.focusType === 'analytical' && currentEmotion.emotion !== 'brain-dead') ||
                        (requirement.focusType === 'creative' && currentEmotion.emotion === 'energized') ||
                        (requirement.focusType === 'mental' && currentEmotion.emotion !== 'tired');

      return energyMatch && focusMatch;
    });

    // Suggest alternatives for low energy states
    let suggestedAlternatives: Task[] = [];
    if (currentEmotion.emotion === 'brain-dead' || currentEmotion.emotion === 'tired') {
      suggestedAlternatives = tasks.filter(task => {
        const requirement = getTaskEnergyRequirement(task.id);
        return requirement && requirement.energyLevel === 'low' && requirement.focusType === 'routine';
      });
    }

    const energyOptimization = currentEmotion.emotion === 'brain-dead'
      ? "Try a simple, routine task or take a short break"
      : currentEmotion.emotion === 'tired'
      ? "Consider light tasks or a quick rest"
      : currentEmotion.emotion === 'anxious'
      ? "Start with something familiar and structured"
      : "You're in a good state for meaningful work";

    return {
      currentEmotion,
      matchingTasks,
      suggestedAlternatives,
      energyOptimization
    };
  };

  const markTaskCompletedWithEmotion = (taskId: string) => {
    const currentEmotion = getCurrentEmotion();
    if (currentEmotion) {
      setState(prev => ({
        ...prev,
        emotionStates: prev.emotionStates.map(emotion =>
          emotion.id === currentEmotion.id
            ? { ...emotion, tasksCompleted: [...emotion.tasksCompleted, taskId] }
            : emotion
        )
      }));
    }
  };

  // Reminder Functions
  const reminderManager = new ReminderManager(
    state.reminderSettings,
    state.reminders,
    state.snoozeReasons,
    state.reminderPatterns
  );

  const createReminder = (task: Task, tone?: 'encouraging' | 'neutral' | 'humorous') => {
    const reminder = reminderManager.createReminder(task, tone);
    reminderManager.addReminder(reminder);

    setState(prev => ({
      ...prev,
      ...reminderManager.data
    }));

    return reminder;
  };

  const snoozeReminder = (reminderId: string, reason: string) => {
    const result = reminderManager.snoozeReminder(reminderId, reason);
    if (result) {
      setState(prev => ({
        ...prev,
        ...reminderManager.data
      }));
    }
    return result;
  };

  const completeReminder = (reminderId: string) => {
    const result = reminderManager.completeReminder(reminderId);
    if (result) {
      setState(prev => ({
        ...prev,
        ...reminderManager.data
      }));
    }
    return result;
  };

  const updateReminderSettings = (newSettings: Partial<typeof state.reminderSettings>) => {
    reminderManager.updateSettings(newSettings);

    setState(prev => ({
      ...prev,
      ...reminderManager.data
    }));
  };

  const getActiveReminders = () => {
    return reminderManager.getActiveReminders();
  };

  const getSuggestedReasons = () => {
    return reminderManager.getSuggestedReasons();
  };

  const getCompletionMessage = () => {
    return reminderManager.getCompletionMessage();
  };

  // Emergency Mode Functions
  const activateEmergencyMode = (deadline: Date) => {
    // Perform rapid assessment
    const assessment = performEmergencyAssessment(deadline);

    setState(prev => ({
      ...prev,
      emergencyMode: {
        ...prev.emergencyMode,
        isActive: true,
        activatedAt: new Date(),
        deadline,
        essentialTasks: assessment.essentialTasks,
        timeBoxingEnabled: true,
        enforcedBreaks: true
      },
      emergencyAssessments: [...prev.emergencyAssessments, assessment]
    }));
  };

  const deactivateEmergencyMode = () => {
    setState(prev => ({
      ...prev,
      emergencyMode: {
        ...prev.emergencyMode,
        isActive: false,
        activatedAt: null,
        deadline: null,
        essentialTasks: []
      }
    }));
  };

  const getEmergencyModeInfo = () => {
    const mode = state.emergencyMode;
    const timeUntilDeadline = mode.deadline
      ? Math.max(0, mode.deadline.getTime() - Date.now())
      : null;

    return {
      ...mode,
      timeUntilDeadline,
      isEmergency: mode.isActive,
      timeLeftFormatted: timeUntilDeadline
        ? formatTimeLeft(timeUntilDeadline)
        : null
    };
  };

  const startEmergencyPomodoro = (taskIds: string[]) => {
    // Start with the first essential task
    const firstTaskId = taskIds[0];
    if (firstTaskId) {
      startTwoMinuteTimer(firstTaskId);
    }
  };

  const completeEmergencyReflection = (reflection: string) => {
    // Log the reflection and deactivate emergency mode
    console.log('Emergency reflection:', reflection);

    setState(prev => ({
      ...prev,
      emergencyMode: {
        ...prev.emergencyMode,
        isActive: false,
        activatedAt: null,
        deadline: null,
        essentialTasks: []
      }
    }));
  };

  const performEmergencyAssessment = (deadline: Date): EmergencyAssessment => {
    const totalTasks = state.tasks.length;
    const timeAvailable = Math.max(0, deadline.getTime() - Date.now());
    const timeAvailableMinutes = Math.floor(timeAvailable / (1000 * 60));

    // Triage logic: prioritize incomplete tasks with highest urgency
    const urgentTasks = state.tasks
      .filter(task => !task.isCompleted)
      .sort((a, b) => {
        // Simple prioritization: newer tasks are more urgent, longer descriptions might be more complex
        const aUrgency = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        const bComplexity = b.description ? b.description.length : 0;
        const aComplexity = a.description ? a.description.length : 0;
        return aUrgency - (bComplexity - aComplexity);
      });

    // Determine how many tasks we can realistically handle
    const estimatedTaskTime = 15; // Assume 15 minutes per task for emergency mode
    const essentialCount = Math.min(
      urgentTasks.length,
      Math.floor(timeAvailableMinutes / estimatedTaskTime)
    );

    const essentialTasks = urgentTasks.slice(0, essentialCount).map(t => t.id);
    const cuttableTasks = urgentTasks.slice(essentialCount).length;

    const recommendations = getEmergencyRecommendations(timeAvailableMinutes, essentialTasks.length);

    return {
      id: `assessment-${Date.now()}`,
      assessmentTime: new Date(),
      deadline,
      totalTasks,
      essentialTaskCount: essentialCount,
      essentialTasks,
      cuttableTasks,
      timeAvailable: timeAvailableMinutes,
      recommendations,
      triageDecision: essentialCount > 0 ? 'urgent' : 'can_wait'
    };
  };

  const getEmergencyRecommendations = (timeAvailable: number, essentialTaskCount: number): string[] => {
    const recommendations: string[] = [];

    if (timeAvailable < 30) {
      recommendations.push("Focus on ONE critical task only");
      recommendations.push("Use 5-minute time boxes");
      recommendations.push("Skip planning, just start");
    } else if (timeAvailable < 120) {
      recommendations.push("Prioritize tasks by impact vs effort");
      recommendations.push("Use 25-minute pomodoros with 5-minute breaks");
      recommendations.push("Focus on completion, not perfection");
    } else {
      recommendations.push("You have time for proper planning");
      recommendations.push("Break complex tasks into micro-steps");
      recommendations.push("Use normal work patterns");
    }

    if (essentialTaskCount > 5) {
      recommendations.push("Consider delegating or deferring non-critical items");
    }

    recommendations.push("Stay hydrated and take short breaks");
    recommendations.push("Focus on progress, not perfection");

    return recommendations;
  };

  const formatTimeLeft = (milliseconds: number): string => {
    const totalMinutes = Math.floor(milliseconds / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  return {
    state,
    addTask,
    deleteTask,
    generateBreakdown,
    acceptBreakdown,
    rejectBreakdown,
    modifyBreakdown,
    toggleStepCompletion,
    getCurrentBreakdown,
    startTwoMinuteTimer,
    stopTimer,
    pauseTimer,
    resumeTimer,
    getTimerProgress,
    getRemainingTime,
    isTimerFinished,
    resetTimer,
    togglePerfectionismMode,
    trackProcrastinationPattern,
    markTaskStarted,
    generateInsights,
    createContextSnapshot,
    addContextNote,
    getPreviousContext,
    getTimelineView,
    startWorkSession,
    endWorkSession,
    getCurrentSession,
    setCurrentEmotion,
    getCurrentEmotion,
    setTaskEnergyRequirement,
    getTaskEnergyRequirement,
    getSmartTaskFilter,
    markTaskCompletedWithEmotion,
    createReminder,
    snoozeReminder,
    completeReminder,
    updateReminderSettings,
    getActiveReminders,
    getSuggestedReasons,
    getCompletionMessage,
    activateEmergencyMode,
    deactivateEmergencyMode,
    getEmergencyModeInfo,
    startEmergencyPomodoro,
    completeEmergencyReflection
  };
}

// Utility functions for progress tracking
function updateProgressState(progress: ProgressState, completedSteps: number): ProgressState {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // Update daily stats
  let dailyStats = [...progress.dailyStats];
  const todayIndex = dailyStats.findIndex(d => d.date === today);

  if (todayIndex >= 0) {
    dailyStats[todayIndex] = {
      ...dailyStats[todayIndex],
      stepsCompleted: completedSteps
    };
  } else {
    dailyStats.push({
      date: today,
      stepsCompleted: completedSteps,
      timeSpent: 0,
      tasksStarted: []
    });
  }

  // Update streaks
  let currentStreak = progress.currentStreak;
  let longestStreak = progress.longestStreak;

  if (progress.lastActiveDate === yesterday) {
    currentStreak += 1;
    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
    }
  } else if (progress.lastActiveDate !== today) {
    currentStreak = 1;
  }

  // Check for achievements
  const achievements = checkAchievements({
    ...progress,
    dailyStats,
    currentStreak,
    longestStreak,
    lastActiveDate: today
  });

  return {
    ...progress,
    totalStepsCompleted: completedSteps,
    currentStreak,
    longestStreak,
    lastActiveDate: today,
    achievements,
    dailyStats
  };
}

function checkAchievements(progress: ProgressState): Achievement[] {
  const existingAchievements = progress.achievements;
  const newAchievements: Achievement[] = [];

  // Check for 5 First Steps achievement
  if (progress.totalStepsCompleted >= 5 &&
      !existingAchievements.some(a => a.id === 'five_steps')) {
    newAchievements.push({
      id: 'five_steps',
      title: '5 First Steps',
      description: 'Complete 5 micro-steps',
      icon: '👟',
      unlockedAt: new Date(),
      isUnlocked: true
    });
  }

  // Check for Morning Warrior achievement (3 consecutive days with activity before 10 AM)
  if (progress.currentStreak >= 3 &&
      !existingAchievements.some(a => a.id === 'morning_warrior')) {
    // This would need more sophisticated time tracking, simplified for now
    newAchievements.push({
      id: 'morning_warrior',
      title: 'Morning Warrior',
      description: '3 consecutive days of progress',
      icon: '🌅',
      unlockedAt: new Date(),
      isUnlocked: true
    });
  }

  return [...existingAchievements, ...newAchievements];
}