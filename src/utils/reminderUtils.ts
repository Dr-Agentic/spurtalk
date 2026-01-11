import { Reminder, ReminderSettings, SnoozeReason, ReminderPattern, Task } from '../types';

/**
 * Procrastination-friendly reminder system
 * Focuses on encouragement, understanding, and smart timing
 */
export class ReminderManager {
  private settings: ReminderSettings;
  private reminders: Reminder[];
  private snoozeReasons: SnoozeReason[];
  private patterns: ReminderPattern[];

  constructor(settings: ReminderSettings, reminders: Reminder[] = [], snoozeReasons: SnoozeReason[] = [], patterns: ReminderPattern[] = []) {
    this.settings = settings;
    this.reminders = reminders;
    this.snoozeReasons = snoozeReasons;
    this.patterns = patterns;
  }

  // Getters for state management
  get data() {
    return {
      reminders: this.reminders,
      settings: this.settings,
      snoozeReasons: this.snoozeReasons,
      patterns: this.patterns
    };
  }

  /**
   * Create a new reminder with procrastination-friendly messaging
   */
  createReminder(task: Task, tone?: 'encouraging' | 'neutral' | 'humorous'): Reminder {
    const baseMessages = this.getBaseMessages(task.title);
    const toneMessages = this.getToneMessages(tone || this.settings.tone);

    return {
      id: `reminder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      taskId: task.id,
      title: `About your "${task.title}" task...`,
      message: this.selectMessage(baseMessages, toneMessages),
      tone: tone || this.settings.tone,
      scheduledTime: this.calculateOptimalTime(task.id),
      isSnoozed: false,
      snoozeCount: 0,
      lastSnoozeTime: null,
      isCompleted: false,
      completedAt: null,
      createdAt: new Date()
    };
  }

  /**
   * Generate base messages that are non-judgmental
   */
  private getBaseMessages(taskTitle: string): string[] {
    return [
      `Hey there! Just checking in about "${taskTitle}". No pressure, just wanted to say hi!`,
      `I see "${taskTitle}" on your list. When you're ready, I'm here to help!`,
      `Remember "${taskTitle}"? It's waiting for you whenever you feel up to it!`,
      `Just a gentle nudge about "${taskTitle}" - think of it as a friendly reminder, not a demand!`,
      `Your "${taskTitle}" task is still there, patiently waiting for the perfect moment!`
    ];
  }

  /**
   * Get tone-specific message variants
   */
  private getToneMessages(tone: 'encouraging' | 'neutral' | 'humorous'): string[] {
    switch (tone) {
      case 'encouraging':
        return [
          'You\'ve got this! Even a tiny step counts as progress.',
          'Remember, every expert was once a beginner. You\'re doing great!',
          'Small actions lead to big results. What\'s one tiny thing you could do?',
          'Progress over perfection! What feels manageable right now?',
          'You\'re not behind. You\'re exactly where you need to be right now.'
        ];
      case 'neutral':
        return [
          'This task is available when you want to work on it.',
          'No urgency here, just noting this is still in your list.',
          'When you decide to start, I\'ll be here to support you.',
          'This remains available for whenever you feel ready.',
          'Taking breaks is part of the process. Come back when you\'re refreshed.'
        ];
      case 'humorous':
        return [
          'Your task is doing the awkward turtle flip while waiting. Help it out?',
          'I promise this task won\'t bite! Probably. Maybe. Ok, it might be challenging.',
          'Even Beyoncé procrastinates sometimes. You\'re in good company!',
          'This task won\'t judge you if you start small. Unlike your cat.',
          'Procrastination level: Professional. Ready to level up to Expert?'
        ];
      default:
        return [];
    }
  }

  /**
   * Select the most appropriate message
   */
  private selectMessage(baseMessages: string[], toneMessages: string[]): string {
    const allMessages = [...baseMessages, ...toneMessages];
    return allMessages[Math.floor(Math.random() * allMessages.length)];
  }

  /**
   * Calculate optimal timing based on user patterns
   */
  private calculateOptimalTime(taskId: string): Date {
    const pattern = this.patterns.find(p => p.taskId === taskId);

    if (pattern && this.settings.smartTiming) {
      const optimal = pattern.optimalTiming;
      const now = new Date();
      const targetHour = optimal.timeOfDay;

      // Set for optimal time today or next optimal day
      const scheduled = new Date(now);
      scheduled.setHours(targetHour, 0, 0, 0);

      if (scheduled <= now) {
        // If optimal time has passed, schedule for tomorrow at optimal time
        scheduled.setDate(scheduled.getDate() + 1);
      }

      return scheduled;
    }

    // Default: 2 hours from now
    const defaultTime = new Date();
    defaultTime.setHours(defaultTime.getHours() + 2);
    return defaultTime;
  }

  /**
   * Handle snooze with reason capture
   */
  snoozeReminder(reminderId: string, reason: string): Reminder | null {
    const reminder = this.reminders.find(r => r.id === reminderId);
    if (!reminder || reminder.isCompleted) return null;

    // Check max snooze limit
    if (reminder.snoozeCount >= this.settings.maxSnoozes) {
      // Auto-complete if max snoozes reached
      return this.completeReminder(reminderId);
    }

    // Create snooze reason record or update existing
    this.recordSnoozeReason(reason);

    // Update reminder
    reminder.isSnoozed = true;
    reminder.snoozeReason = reason;
    reminder.snoozeCount += 1;
    reminder.lastSnoozeTime = new Date();
    reminder.scheduledTime = new Date(Date.now() + this.settings.snoozeDuration * 60000);

    // Update pattern data
    this.updatePatternData(reminder.taskId, reason);

    return reminder;
  }

  /**
   * Complete a reminder
   */
  completeReminder(reminderId: string): Reminder | null {
    const reminder = this.reminders.find(r => r.id === reminderId);
    if (!reminder || reminder.isCompleted) return null;

    reminder.isCompleted = true;
    reminder.completedAt = new Date();
    reminder.isSnoozed = false;

    return reminder;
  }

  /**
   * Get active reminders (not snoozed, not completed, not spam)
   */
  getActiveReminders(): Reminder[] {
    const now = new Date();

    return this.reminders.filter(reminder => {
      // Filter out completed reminders
      if (reminder.isCompleted) return false;

      // Filter out snoozed reminders unless snooze time has passed
      if (reminder.isSnoozed) {
        if (!reminder.lastSnoozeTime) return false;
        const snoozeEnd = new Date(reminder.lastSnoozeTime.getTime() + this.settings.snoozeDuration * 60000);
        if (now < snoozeEnd) return false;
      }

      // Check spam protection
      if (this.settings.spamProtection) {
        if (reminder.snoozeCount > 2) return false; // Don't spam if user keeps snoozing
      }

      // Check if it's time for the reminder
      return now >= reminder.scheduledTime;
    });
  }

  /**
   * Update snooze reason frequency
   */
  private recordSnoozeReason(reason: string): void {
    const existing = this.snoozeReasons.find(sr => sr.reason === reason);
    if (existing) {
      existing.frequency += 1;
    } else {
      this.snoozeReasons.push({
        id: `reason-${Date.now()}`,
        reason,
        frequency: 1,
        suggestedAlternatives: this.getSuggestionsForReason(reason)
      });
    }
  }

  /**
   * Get suggestions for common snooze reasons
   */
  private getSuggestionsForReason(reason: string): string[] {
    const suggestions: Record<string, string[]> = {
      'not now': [
        'Take a 5-minute walk first',
        'Do just the first 2 minutes',
        'Break it into even smaller steps'
      ],
      'too tired': [
        'Try a different time of day',
        'Do something energizing first',
        'Save for when you have more energy'
      ],
      'too busy': [
        'Can you delegate this?',
        'Is there a simpler version?',
        'Schedule a specific time later'
      ],
      'not motivated': [
        'Start with something you enjoy',
        'Pair with a pleasant activity',
        'Focus on why this matters to you'
      ],
      'overwhelmed': [
        'Break it down further',
        'Ask for help or guidance',
        'Start with the easiest part'
      ]
    };

    return suggestions[reason.toLowerCase()] || ['Try breaking this down further', 'Consider doing just 2 minutes', 'Ask yourself what would make this easier'];
  }

  /**
   * Update pattern data for learning
   */
  private updatePatternData(taskId: string, reason: string): void {
    let pattern = this.patterns.find(p => p.taskId === taskId);
    if (!pattern) {
      pattern = {
        taskId,
        snoozeHistory: [],
        optimalTiming: {
          timeOfDay: new Date().getHours(),
          dayOfWeek: new Date().getDay(),
          energyLevel: 'medium'
        },
        completionRate: 0
      };
      this.patterns.push(pattern);
    }

    pattern.snoozeHistory.push({
      reason,
      timestamp: new Date(),
      duration: this.settings.snoozeDuration
    });

    // Update completion rate
    const totalReminders = this.reminders.filter(r => r.taskId === taskId).length;
    const completedReminders = this.reminders.filter(r => r.taskId === taskId && r.isCompleted).length;
    pattern.completionRate = totalReminders > 0 ? completedReminders / totalReminders : 0;
  }

  /**
   * Get suggested snooze reasons based on user history
   */
  getSuggestedReasons(): string[] {
    // Return top 3 most frequent reasons
    return this.snoozeReasons
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 3)
      .map(sr => sr.reason);
  }

  /**
   * Get celebration message for completed actions
   */
  getCompletionMessage(): string {
    const messages = [
      '🎉 Wonderful! You took action - that\'s what matters most!',
      '🌟 Progress! Every step forward counts, no matter how small.',
      '💪 You did it! That momentum will carry you forward.',
      '✨ Beautiful! Consistency beats perfection every time.',
      '🚀 Fantastic! You\'re building momentum, one step at a time.'
    ];

    return messages[Math.floor(Math.random() * messages.length)];
  }

  /**
   * Update settings
   */
  updateSettings(newSettings: Partial<ReminderSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
  }

  /**
   * Add or update a reminder
   */
  addReminder(reminder: Reminder): void {
    const existingIndex = this.reminders.findIndex(r => r.id === reminder.id);
    if (existingIndex >= 0) {
      this.reminders[existingIndex] = reminder;
    } else {
      this.reminders.push(reminder);
    }
  }

  /**
   * Remove a reminder
   */
  removeReminder(reminderId: string): void {
    this.reminders = this.reminders.filter(r => r.id !== reminderId);
  }
}

// Default reminder settings
export const defaultReminderSettings: ReminderSettings = {
  enabled: true,
  tone: 'encouraging',
  maxSnoozes: 3,
  snoozeDuration: 30, // 30 minutes
  smartTiming: true,
  spamProtection: true,
  celebrationEnabled: true
};