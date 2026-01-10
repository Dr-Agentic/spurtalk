import { useState, useEffect } from 'react';
import { AppState, Task, MicroStep, TaskBreakdown } from '../types';
import { generateMicroSteps, simulateAiResponse } from '../utils/taskBreakdown';

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
          }))
        };
      } catch (e) {
        console.warn('Failed to parse saved state, using defaults');
      }
    }
    return {
      tasks: [],
      breakdowns: [],
      currentStep: null
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
    setState(prev => ({
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
    }));
  };

  const getCurrentBreakdown = (taskId: string) => {
    return state.breakdowns.find(b => b.taskId === taskId);
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
    getCurrentBreakdown
  };
}