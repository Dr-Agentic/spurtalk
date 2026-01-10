import {
  ProcrastinationData,
  Task,
  ProcrastinationInsight,
  ProcrastinationPattern
} from '../types';

/**
 * Procrastination pattern analysis and insight generation
 */
export class ProcrastinationInsights {
  private procrastinationData: ProcrastinationData;

  constructor(data: ProcrastinationData) {
    this.procrastinationData = data;
  }

  // Make data accessible for state management
  get data(): ProcrastinationData {
    return this.procrastinationData;
  }

  /**
   * Analyze procrastination patterns and generate insights
   */
  generateInsights(): ProcrastinationInsight[] {
    const patterns = [
      ...this.analyzeTimeOfDayPatterns(),
      ...this.analyzeTaskTypePatterns(),
      ...this.analyzeEmotionalTriggers(),
      ...this.analyzeDeadlinePatterns()
    ];

    const insights = this.createInsightsFromPatterns(patterns);
    return insights;
  }

  /**
   * Track a new task delay record
   */
  trackTaskDelay(task: Task, emotionalState?: string): void {
    const existingRecord = this.data.taskDelayHistory.find(
      record => record.taskId === task.id
    );

    if (existingRecord) {
      // Update existing record if first action not set
      if (!existingRecord.firstActionDate) {
        existingRecord.firstActionDate = new Date();
        existingRecord.delayHours = this.calculateDelayHours(
          existingRecord.createdDate,
          existingRecord.firstActionDate
        );
        existingRecord.emotionalState = emotionalState;
      }
    } else {
      // Create new record
      this.data.taskDelayHistory.push({
        taskId: task.id,
        taskTitle: task.title,
        createdDate: task.createdAt,
        firstActionDate: null,
        delayHours: null,
        emotionalState
      });
    }
  }

  /**
   * Mark task as started (first action taken)
   */
  markTaskStarted(taskId: string, emotionalState?: string): void {
    const record = this.data.taskDelayHistory.find(r => r.taskId === taskId);
    if (record) {
      record.firstActionDate = new Date();
      record.delayHours = this.calculateDelayHours(
        record.createdDate,
        record.firstActionDate
      );
      record.emotionalState = emotionalState;
    }
  }

  private analyzeTimeOfDayPatterns(): ProcrastinationPattern[] {
    const patterns: ProcrastinationPattern[] = [];

    // Group data by day of week and hour
    const hourlyData = new Map<string, { completions: number; delays: number[] }>();

    this.data.taskDelayHistory.forEach(record => {
      if (record.firstActionDate) {
        const day = record.firstActionDate.getDay();
        const hour = record.firstActionDate.getHours();
        const key = `${day}-${hour}`;

        const existing = hourlyData.get(key) || { completions: 0, delays: [] };
        existing.completions++;
        if (record.delayHours !== null) {
          existing.delays.push(record.delayHours);
        }
        hourlyData.set(key, existing);
      }
    });

    // Find patterns
    hourlyData.forEach((data, key) => {
      const [day, hour] = key.split('-').map(Number);
      const avgDelay = data.delays.length > 0
        ? data.delays.reduce((a, b) => a + b, 0) / data.delays.length
        : 0;

      if (avgDelay > 24) { // More than 1 day delay
        patterns.push({
          id: `time-${day}-${hour}`,
          patternType: 'time_of_day',
          description: `You tend to procrastinate on tasks started at ${hour}:00 on ${this.getDayName(day)}`,
          frequency: data.delays.length,
          lastObserved: new Date(),
          suggestions: [
            `Try scheduling important tasks for ${this.getOptimalTimeForDay(day)}`,
            `Use the 2-minute rule when you feel the urge to delay`
          ],
          isActionable: true
        });
      }
    });

    return patterns;
  }

  private analyzeTaskTypePatterns(): ProcrastinationPattern[] {
    const patterns: ProcrastinationPattern[] = [];

    // Categorize tasks and analyze patterns
    const typeAnalysis = new Map<string, { delays: number[]; completions: number }>();

    this.procrastinationData.taskDelayHistory.forEach(record => {
      const type = this.getTaskTypeFromTitle(record.taskTitle);
      if (!typeAnalysis.has(type)) {
        typeAnalysis.set(type, { delays: [], completions: 0 });
      }

      const analysis = typeAnalysis.get(type)!;
      if (record.firstActionDate) {
        analysis.completions++;
        if (record.delayHours !== null) {
          analysis.delays.push(record.delayHours);
        }
      }
    });

    typeAnalysis.forEach((data, type) => {
      const avgDelay = data.delays.length > 0
        ? data.delays.reduce((a, b) => a + b, 0) / data.delays.length
        : 0;

      if (avgDelay > 12) { // More than half day delay
        patterns.push({
          id: `type-${type}`,
          patternType: 'task_type',
          description: `You procrastinate significantly on ${type} tasks`,
          frequency: data.delays.length,
          lastObserved: new Date(),
          suggestions: this.generateTaskTypeSuggestions(type),
          isActionable: true
        });
      }
    });

    return patterns;
  }

  private analyzeEmotionalTriggers(): ProcrastinationPattern[] {
    const patterns: ProcrastinationPattern[] = [];
    const emotionalData = new Map<string, { delays: number[]; tasks: string[] }>();

    this.procrastinationData.taskDelayHistory.forEach(record => {
      if (record.emotionalState) {
        const emotion = record.emotionalState.toLowerCase();
        if (!emotionalData.has(emotion)) {
          emotionalData.set(emotion, { delays: [], tasks: [] });
        }

        const data = emotionalData.get(emotion)!;
        data.tasks.push(record.taskTitle);

        if (record.delayHours !== null) {
          data.delays.push(record.delayHours);
        }
      }
    });

    emotionalData.forEach((data, emotion) => {
      const avgDelay = data.delays.length > 0
        ? data.delays.reduce((a, b) => a + b, 0) / data.delays.length
        : 0;

      if (avgDelay > 6) { // More than 6 hours delay
        patterns.push({
          id: `emotion-${emotion}`,
          patternType: 'mood_based',
          description: `You tend to delay tasks when feeling ${emotion}`,
          frequency: data.delays.length,
          lastObserved: new Date(),
          suggestions: this.generateEmotionalSuggestions(emotion),
          isActionable: true
        });
      }
    });

    return patterns;
  }

  private analyzeDeadlinePatterns(): ProcrastinationPattern[] {
    const patterns: ProcrastinationPattern[] = [];
    const deadlineData = new Map<number, { completions: number; delays: number[] }>();

    // Analyze tasks based on time until theoretical deadline
    // For now, we'll use task creation date as a proxy
    this.procrastinationData.taskDelayHistory.forEach(record => {
      if (record.firstActionDate) {
        const daysSinceCreation = Math.floor(
          (record.firstActionDate.getTime() - record.createdDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (!deadlineData.has(daysSinceCreation)) {
          deadlineData.set(daysSinceCreation, { completions: 0, delays: [] });
        }

        const data = deadlineData.get(daysSinceCreation)!;
        data.completions++;

        if (record.delayHours !== null) {
          data.delays.push(record.delayHours);
        }
      }
    });

    deadlineData.forEach((data, days) => {
      const avgDelay = data.delays.length > 0
        ? data.delays.reduce((a, b) => a + b, 0) / data.delays.length
        : 0;

      if (days > 3 && avgDelay > 24) { // Delayed more than 3 days with significant delay
        patterns.push({
          id: `deadline-${days}`,
          patternType: 'deadline_procrastination',
          description: `You tend to procrastinate significantly when you have ${days}+ days until a task "deadline"`,
          frequency: data.delays.length,
          lastObserved: new Date(),
          suggestions: [
            `Try using the "2-minute rule" for tasks with distant deadlines`,
            `Break large tasks into smaller steps with closer micro-deadlines`,
            `Schedule regular check-ins with your accountability partner`
          ],
          isActionable: true
        });
      }
    });

    return patterns;
  }

  private createInsightsFromPatterns(patterns: ProcrastinationPattern[]): ProcrastinationInsight[] {
    const insights: ProcrastinationInsight[] = [];

    // Create weekly report insights
    if (patterns.length > 0) {
      insights.push({
        id: `weekly-${Date.now()}`,
        title: "Your Procrastination Patterns This Week",
        description: "Here's what we've learned about your procrastination tendencies",
        createdAt: new Date(),
        patterns: patterns.slice(0, 3), // Top 3 patterns
        actionableSuggestions: this.generateWeeklySuggestions(patterns),
        isWeeklyReport: true
      });
    }

    // Create specific insights for actionable patterns
    patterns.forEach(pattern => {
      if (pattern.isActionable) {
        insights.push({
          id: `specific-${pattern.id}`,
          title: pattern.description,
          description: this.generatePatternDescription(pattern),
          createdAt: new Date(),
          patterns: [pattern],
          actionableSuggestions: pattern.suggestions,
          isWeeklyReport: false
        });
      }
    });

    return insights;
  }

  private calculateDelayHours(createdDate: Date,actionDate: Date): number {
    const diffMs = actionDate.getTime() - createdDate.getTime();
    return diffMs / (1000 * 60 * 60);
  }

  private getDayName(day: number): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[day] || 'Unknown';
  }

  private getOptimalTimeForDay(day: number): string {
    // Return optimal times based on day of week
    if (day === 0 || day === 6) return 'morning hours';
    if (day >= 1 && day <= 4) return 'late morning or early afternoon';
    return 'late morning';
  }

  private getTaskTypeFromTitle(title: string): string {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('write') || lowerTitle.includes('create')) return 'creative';
    if (lowerTitle.includes('email') || lowerTitle.includes('admin')) return 'administrative';
    if (lowerTitle.includes('learn') || lowerTitle.includes('study')) return 'learning';
    if (lowerTitle.includes('clean') || lowerTitle.includes('organize')) return 'routine';
    return 'miscellaneous';
  }

  private generateTaskTypeSuggestions(taskType: string): string[] {
    const suggestions: string[] = [];

    switch (taskType) {
      case 'creative':
        suggestions.push(
          "Try the 'ugly first draft' approach - quality comes later",
          "Set a 2-minute timer and just start with anything",
          "Use the 'just one sentence' or 'one brushstroke' method"
        );
        break;
      case 'administrative':
        suggestions.push(
          "Batch similar tasks together",
          "Use the 'one-touch' rule for emails and paperwork",
          "Schedule admin time when you have highest energy"
        );
        break;
      case 'learning':
        suggestions.push(
          "Start with just 5 minutes of reading",
          "Focus on understanding one concept at a time",
          "Use the 'teach it to a friend' method to reinforce learning"
        );
        break;
      default:
        suggestions.push(
          "Break the task into smaller, more specific steps",
          "Use the 2-minute rule to get started",
          "Consider if this task aligns with your current priorities"
        );
    }

    return suggestions;
  }

  private generateEmotionalSuggestions(emotion: string): string[] {
    const suggestions: string[] = [];

    switch (emotion) {
      case 'anxious':
        suggestions.push(
          "Try the '5-4-3-2-1' grounding technique before starting",
          "Focus on what you can control in this moment",
          "Break tasks into micro-steps to reduce overwhelm"
        );
        break;
      case 'overwhelmed':
        suggestions.push(
          "Use the 'brain dump' technique to clear your mind",
          "Choose ONE thing to focus on right now",
          "Remember: done is better than perfect"
        );
        break;
      case 'tired':
        suggestions.push(
          "Try a 10-minute power nap before starting",
          "Complete the task in a different environment",
          "Use energizing music or ambient sounds"
        );
        break;
      case 'bored':
        suggestions.push(
          "Add a small challenge or game element to the task",
          "Pair the task with something enjoyable (music, podcast)",
          "Set a timer and race against the clock"
        );
        break;
      default:
        suggestions.push(
          "Notice what you're feeling without judgment",
          "Try a brief mindfulness exercise",
          "Start with the smallest possible action"
        );
    }

    return suggestions;
  }

  private generateWeeklySuggestions(patterns: ProcrastinationPattern[]): string[] {
    const suggestions: string[] = [
      "Review your top procrastination patterns and choose one to work on this week",
      "Set up gentle reminders for your optimal working times",
      "Practice self-compassion when you notice procrastination - it's a habit, not a character flaw"
    ];

    const timePatterns = patterns.filter(p => p.patternType === 'time_of_day');
    const taskPatterns = patterns.filter(p => p.patternType === 'task_type');
    const emotionPatterns = patterns.filter(p => p.patternType === 'mood_based');

    if (timePatterns.length > 0) {
      suggestions.push("Notice when you work best and schedule important tasks for those times");
    }

    if (taskPatterns.length > 0) {
      suggestions.push("Use the 2-minute rule for tasks you typically avoid");
    }

    if (emotionPatterns.length > 0) {
      suggestions.push("Check in with your emotional state before starting tasks");
    }

    return suggestions;
  }

  private generatePatternDescription(pattern: ProcrastinationPattern): string {
    switch (pattern.patternType) {
      case 'time_of_day':
        return "You have specific times when procrastination tends to win. This is normal and workable!";
      case 'task_type':
        return "Certain types of tasks trigger your procrastination more than others. Let's work with that!";
      case 'mood_based':
        return "Your emotional state influences when you procrastinate. This is valuable self-awareness!";
      case 'deadline_procrastination':
        return "You have patterns around how you handle deadlines. Many people struggle with this!";
      default:
        return "You're becoming more aware of your procrastination patterns. That's the first step to change!";
    }
  }
}