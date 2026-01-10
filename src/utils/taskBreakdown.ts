import { MicroStep, TaskBreakdown } from '../types';

/**
 * AI-powered task breakdown that simulates intelligent decomposition
 * In a real app, this would call an LLM API
 */
export function generateMicroSteps(originalTask: string): MicroStep[] {
  // Simulate AI breakdown logic
  const steps = simulateTaskBreakdown(originalTask);

  return steps.map((step, index) => ({
    id: `step-${Date.now()}-${index}`,
    title: step.title,
    description: step.description,
    estimatedTime: step.estimatedTime,
    isCompleted: false,
    createdAt: new Date()
  }));
}

/**
 * Simulates AI task decomposition logic
 * In production, this would be replaced with actual LLM calls
 */
function simulateTaskBreakdown(task: string): Array<{ title: string; description?: string; estimatedTime: number }> {
  const taskLower = task.toLowerCase();

  // Pattern matching for common task types
  if (taskLower.includes('write') || taskLower.includes('research')) {
    return [
      { title: 'Gather research materials', estimatedTime: 5 },
      { title: 'Create outline or structure', estimatedTime: 3 },
      { title: 'Write first paragraph/section', estimatedTime: 10 },
      { title: 'Review and edit initial content', estimatedTime: 5 },
      { title: 'Add supporting details', estimatedTime: 10 }
    ];
  }

  if (taskLower.includes('organize') || taskLower.includes('clean')) {
    return [
      { title: 'Clear workspace surface', estimatedTime: 2 },
      { title: 'Sort items into categories', estimatedTime: 5 },
      { title: 'Put away misplaced items', estimatedTime: 5 },
      { title: 'Wipe down surfaces', estimatedTime: 3 },
      { title: 'Organize remaining items', estimatedTime: 5 }
    ];
  }

  if (taskLower.includes('learn') || taskLower.includes('study')) {
    return [
      { title: 'Find learning resources', estimatedTime: 3 },
      { title: 'Read introduction/overview', estimatedTime: 10 },
      { title: 'Take notes on key concepts', estimatedTime: 10 },
      { title: 'Practice with examples', estimatedTime: 15 },
      { title: 'Review and summarize learning', estimatedTime: 5 }
    ];
  }

  if (taskLower.includes('plan') || taskLower.includes('prepare')) {
    return [
      { title: 'Define clear objectives', estimatedTime: 3 },
      { title: 'Research requirements', estimatedTime: 5 },
      { title: 'Create detailed checklist', estimatedTime: 5 },
      { title: 'Gather necessary materials', estimatedTime: 5 },
      { title: 'Set up workspace', estimatedTime: 2 }
    ];
  }

  if (taskLower.includes('call') || taskLower.includes('email')) {
    return [
      { title: 'Prepare talking points/notes', estimatedTime: 3 },
      { title: 'Draft message or script', estimatedTime: 5 },
      { title: 'Make the call/send email', estimatedTime: 5 },
      { title: 'Follow up if needed', estimatedTime: 3 },
      { title: 'Log the interaction', estimatedTime: 2 }
    ];
  }

  // Default fallback for unknown task types
  return [
    { title: 'Understand the task requirements', estimatedTime: 3 },
    { title: 'Break down into smaller actions', estimatedTime: 5 },
    { title: 'Start with the easiest part', estimatedTime: 5 },
    { title: 'Continue with next steps', estimatedTime: 10 },
    { title: 'Review and complete', estimatedTime: 5 }
  ];
}

/**
 * Simulates AI response time
 */
export function simulateAiResponse(): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, 1000 + Math.random() * 2000); // 1-3 second delay
  });
}

/**
 * Calculates total estimated time for a breakdown
 */
export function calculateTotalTime(breakdown: TaskBreakdown): number {
  return breakdown.microSteps.reduce((total, step) => total + step.estimatedTime, 0);
}

/**
 * Checks if all steps are completed
 */
export function areAllStepsComplete(breakdown: TaskBreakdown): boolean {
  return breakdown.microSteps.every(step => step.isCompleted);
}