import React, { useState } from 'react';
import { Task, MicroStep } from '../types';
import { useAppState } from '../hooks/useAppState';
import { TwoMinuteTimer } from './TwoMinuteTimer';
import { soundEffects } from '../utils/soundEffects';
import { getRandomCompletionMessage } from '../utils/perfectionismUtils';

interface TaskBreakdownAssistantProps {
  task: Task;
}

export const TaskBreakdownAssistant: React.FC<TaskBreakdownAssistantProps> = ({ task }) => {
  const {
    state,
    generateBreakdown,
    acceptBreakdown,
    rejectBreakdown,
    modifyBreakdown,
    getCurrentBreakdown,
    startTwoMinuteTimer,
    toggleStepCompletion,
    getCurrentEmotion,
    setTaskEnergyRequirement,
    getTaskEnergyRequirement
  } = useAppState();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [currentStepId, setCurrentStepId] = useState<string | null>(null);
  const [showEnergyForm, setShowEnergyForm] = useState(false);

  const breakdown = getCurrentBreakdown(task.id);
  const currentEmotion = getCurrentEmotion();
  const taskEnergyRequirement = getTaskEnergyRequirement(task.id);

  const handleStartTwoMinuteTimer = (stepId?: string) => {
    setCurrentStepId(stepId || null);
    setShowTimer(true);
    startTwoMinuteTimer(task.id, stepId);
  };

  const handleTimerCompletion = (keepGoing: boolean) => {
    setShowTimer(false);
    if (keepGoing) {
      // Continue working on the same step
      setTimeout(() => {
        handleStartTwoMinuteTimer(currentStepId || undefined);
      }, 1000);
    }
    // If not keeping going, just stop the timer (celebration already happened)
  };

  const handleStepToggle = (breakdownId: string, stepId: string) => {
    toggleStepCompletion(breakdownId, stepId);
    // Play celebration sound
    soundEffects.playSuccess();

    // Show different message based on perfectionism mode
    if (state.isPerfectionismMode) {
      console.log('🎉', getRandomCompletionMessage());
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    await generateBreakdown(task.id);
    setIsGenerating(false);
    setShowBreakdown(true);
  };

  const handleAccept = () => {
    acceptBreakdown(task.id);
    setShowBreakdown(false);
  };

  const handleReject = () => {
    rejectBreakdown(task.id);
    setShowBreakdown(false);
  };

  
  const addStep = () => {
    if (!breakdown) return;
    const newStep: MicroStep = {
      id: `step-${Date.now()}`,
      title: 'New step',
      estimatedTime: 5,
      isCompleted: false,
      createdAt: new Date()
    };
    modifyBreakdown(task.id, [...breakdown.microSteps, newStep]);
  };

  const removeStep = (stepId: string) => {
    if (!breakdown) return;
    modifyBreakdown(task.id, breakdown.microSteps.filter(step => step.id !== stepId));
  };

  const updateStep = (stepId: string, field: keyof MicroStep, value: any) => {
    if (!breakdown) return;
    modifyBreakdown(task.id, breakdown.microSteps.map(step =>
      step.id === stepId ? { ...step, [field]: value } : step
    ));
  };

  const getTwoMinuteLabel = () => {
    return state.isPerfectionismMode
      ? "🚀 Just 2 Minutes - Start Anywhere!"
      : "⏱️ 2-Minute Start";
  };

  const getGlobalSubtitle = () => {
    return state.isPerfectionismMode
      ? "Good enough is good enough! Pick any step and just start. 🌟"
      : "Pick the easiest step and commit to just 2 minutes. No pressure, just progress! 🌟";
  };

  const handleSetEnergyRequirement = (energyLevel: 'low' | 'medium' | 'high', focusType: 'creative' | 'analytical' | 'routine' | 'mental' | 'physical', estimatedTime: number) => {
    setTaskEnergyRequirement(task.id, energyLevel, focusType, estimatedTime);
    setShowEnergyForm(false);
  };

  const getEmotionMatchIndicator = () => {
    if (!currentEmotion || !taskEnergyRequirement) return null;

    const energyMatch = taskEnergyRequirement.energyLevel === 'low' ||
                       (taskEnergyRequirement.energyLevel === 'medium' && currentEmotion.intensity >= 4) ||
                       (taskEnergyRequirement.energyLevel === 'high' && currentEmotion.intensity >= 7);

    const focusMatch = taskEnergyRequirement.focusType === 'routine' ||
                      (taskEnergyRequirement.focusType === 'analytical' && currentEmotion.emotion !== 'brain-dead') ||
                      (taskEnergyRequirement.focusType === 'creative' && currentEmotion.emotion === 'energized') ||
                      (taskEnergyRequirement.focusType === 'mental' && currentEmotion.emotion !== 'tired');

    if (energyMatch && focusMatch) {
      return { emoji: '✅', color: '#10b981', text: 'Great match for your current state!' };
    } else if (energyMatch || focusMatch) {
      return { emoji: '⚠️', color: '#f59e0b', text: 'Partial match - consider alternatives' };
    } else {
      return { emoji: '❌', color: '#ef4444', text: 'Not ideal for your current state' };
    }
  };

  if (breakdown && breakdown.isAccepted) {
    const emotionMatch = getEmotionMatchIndicator();

    return (
      <div className="breakdown-display">
        <div className="task-header">
          <h3>Task Breakdown</h3>
          {currentEmotion && (
            <div className="current-emotion-badge">
              <span className="emotion-label">Current state: {currentEmotion.emotion} ({currentEmotion.intensity}/10)</span>
            </div>
          )}
        </div>

        {taskEnergyRequirement && (
          <div className="energy-requirement-display">
            <div className="requirement-header">
              <h4>Energy Requirements</h4>
              {emotionMatch && (
                <div className="match-indicator" style={{ borderColor: emotionMatch.color }}>
                  <span className="match-emoji">{emotionMatch.emoji}</span>
                  <span className="match-text">{emotionMatch.text}</span>
                </div>
              )}
            </div>
            <div className="requirement-details">
              <span className="requirement-badge">Energy: {taskEnergyRequirement.energyLevel.toUpperCase()}</span>
              <span className="requirement-badge">Focus: {taskEnergyRequirement.focusType}</span>
              <span className="requirement-badge">Time: {taskEnergyRequirement.estimatedTime} min</span>
              <button onClick={() => setShowEnergyForm(true)} className="edit-energy-btn">Edit</button>
            </div>
          </div>
        )}

        <div className="steps-list">
          {breakdown.microSteps.map(step => (
            <div key={step.id} className={`step-item ${step.isCompleted ? 'completed' : ''}`}>
              <input
                type="checkbox"
                checked={step.isCompleted}
                onChange={() => handleStepToggle(task.id, step.id)}
                className="step-checkbox"
              />
              <span className={`step-title ${step.isCompleted ? 'completed' : ''}`}>
                {step.title}
              </span>
              <span className="step-time">(~{step.estimatedTime} min)</span>
              <button
                onClick={() => handleStartTwoMinuteTimer(step.id)}
                className="two-minute-btn"
              >
                {getTwoMinuteLabel()}
              </button>
            </div>
          ))}
        </div>

        <div className="energy-setup">
          {!taskEnergyRequirement && (
            <button onClick={() => setShowEnergyForm(true)} className="setup-energy-btn">
              📊 Set Energy Requirements
            </button>
          )}
        </div>

        {/* Global 2-Minute Rule Button */}
        <div className="global-two-minute">
          <button
            onClick={() => handleStartTwoMinuteTimer()}
            className="global-two-minute-btn"
          >
            🚀 Just 2 Minutes - Start Anywhere!
          </button>
          <p className="global-two-minute-subtitle">
            {getGlobalSubtitle()}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-breakdown-assistant">
      <div className="assistant-header">
        <h3>AI Task Breakdown Assistant</h3>
        <p>Break down "{task.title}" into tiny, achievable steps</p>
      </div>

      {!showBreakdown && !breakdown ? (
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="generate-btn"
        >
          {isGenerating ? 'Analyzing...' : 'Break this down'}
        </button>
      ) : null}

      {isGenerating && (
        <div className="loading">
          <div className="spinner"></div>
          <p>AI is breaking down your task into manageable steps...</p>
        </div>
      )}

      {breakdown && showBreakdown && (
        <div className="breakdown-suggestions">
          <h4>Here's how you can tackle "{task.title}":</h4>

          <div className="steps-list">
            {breakdown.microSteps.map(step => (
              <div key={step.id} className="step-item">
                <input
                  type="text"
                  value={step.title}
                  onChange={(e) => updateStep(step.id, 'title', e.target.value)}
                  className="step-input"
                />
                <input
                  type="number"
                  value={step.estimatedTime}
                  onChange={(e) => updateStep(step.id, 'estimatedTime', parseInt(e.target.value))}
                  className="time-input"
                  min="1"
                  max="60"
                />
                <button onClick={() => removeStep(step.id)} className="remove-btn">✕</button>
              </div>
            ))}
          </div>

          <div className="breakdown-actions">
            <button onClick={addStep} className="add-step-btn">+ Add Step</button>
            <div className="action-buttons">
              <button onClick={handleReject} className="reject-btn">Not helpful</button>
              <button onClick={handleAccept} className="accept-btn">Looks good!</button>
            </div>
          </div>
        </div>
      )}

      {/* Energy Setup Form */}
      {showEnergyForm && (
        <div className="energy-form-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h4>Set Energy Requirements for "{task.title}"</h4>
              {currentEmotion && (
                <p className="current-emotion">Current state: {currentEmotion.emotion} ({currentEmotion.intensity}/10)</p>
              )}
              <button onClick={() => setShowEnergyForm(false)} className="close-btn">✕</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleSetEnergyRequirement(
                formData.get('energyLevel') as any,
                formData.get('focusType') as any,
                parseInt(formData.get('estimatedTime') as string)
              );
            }} className="energy-form">
              <div className="form-group">
                <label>Energy Level Required</label>
                <select name="energyLevel" defaultValue={taskEnergyRequirement?.energyLevel || 'medium'}>
                  <option value="low">Low - Easy, routine tasks</option>
                  <option value="medium">Medium - Requires some focus</option>
                  <option value="high">High - Demanding, complex tasks</option>
                </select>
              </div>
              <div className="form-group">
                <label>Focus Type Required</label>
                <select name="focusType" defaultValue={taskEnergyRequirement?.focusType || 'routine'}>
                  <option value="routine">📋 Routine - Repetitive, structured</option>
                  <option value="analytical">🧮 Analytical - Logical, problem-solving</option>
                  <option value="creative">🎨 Creative - Imaginative, open-ended</option>
                  <option value="mental">🧠 Mental - Concentration-heavy</option>
                  <option value="physical">💪 Physical - Manual, active</option>
                </select>
              </div>
              <div className="form-group">
                <label>Estimated Time</label>
                <input
                  type="number"
                  name="estimatedTime"
                  defaultValue={taskEnergyRequirement?.estimatedTime || 30}
                  min="1"
                  max="240"
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">Save Requirements</button>
                <button type="button" onClick={() => setShowEnergyForm(false)} className="cancel-btn">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Two-Minute Timer Component */}
      {showTimer && (
        <div className="timer-section">
          <TwoMinuteTimer
            taskId={task.id}
            stepId={currentStepId || undefined}
            onCompletion={handleTimerCompletion}
          />
        </div>
      )}

      <style>{`
        .task-breakdown-assistant {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          margin-top: 1rem;
        }

        .assistant-header h3 {
          margin: 0 0 0.5rem 0;
          color: #374151;
        }

        .assistant-header p {
          margin: 0 0 1.5rem 0;
          color: #6b7280;
          font-size: 0.9rem;
        }

        .generate-btn {
          background: linear-gradient(135deg, #6366f1, #10b981);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .generate-btn:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        .generate-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .loading {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-top: 1rem;
          padding: 1rem;
          background: #f3f4f6;
          border-radius: 8px;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid #e5e7eb;
          border-top: 2px solid #6366f1;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .breakdown-suggestions {
          margin-top: 1.5rem;
        }

        .breakdown-suggestions h4 {
          margin: 0 0 1rem 0;
          color: #374151;
        }

        .steps-list {
          background: #f9fafb;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }

        .step-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem;
          background: white;
          border-radius: 6px;
          margin-bottom: 0.5rem;
          border: 1px solid #e5e7eb;
        }

        .step-input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-size: 1rem;
        }

        .time-input {
          width: 80px;
          padding: 0.25rem 0.5rem;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          text-align: center;
        }

        .remove-btn {
          background: #fee2e2;
          color: #dc2626;
          border: none;
          border-radius: 4px;
          width: 32px;
          height: 32px;
          cursor: pointer;
          font-size: 0.8rem;
        }

        .breakdown-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .add-step-btn {
          background: #e0e7ff;
          color: #4f46e5;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .reject-btn {
          background: #fee2e2;
          color: #dc2626;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        .accept-btn {
          background: linear-gradient(135deg, #10b981, #3b82f6);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .accept-btn:hover {
          transform: translateY(-1px);
        }

        /* New emotion-first styles */
        .task-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .current-emotion-badge {
          background: #eef2ff;
          border: 1px solid #bfdbfe;
          border-radius: 20px;
          padding: 0.25rem 0.75rem;
        }

        .emotion-label {
          font-size: 0.875rem;
          color: #374151;
          font-weight: 600;
        }

        .energy-requirement-display {
          background: #fffbeb;
          border: 1px solid #fde68a;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }

        .requirement-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .requirement-header h4 {
          margin: 0;
          color: #92400e;
          font-size: 1rem;
        }

        .match-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.25rem 0.5rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .match-emoji {
          font-size: 1rem;
        }

        .match-text {
          font-size: 0.875rem;
        }

        .requirement-details {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .requirement-badge {
          background: white;
          border: 1px solid #fde68a;
          color: #92400e;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .edit-energy-btn {
          background: #f59e0b;
          color: white;
          border: none;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
        }

        .energy-setup {
          margin-bottom: 1.5rem;
        }

        .setup-energy-btn {
          background: linear-gradient(135deg, #f59e0b, #f97316);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .setup-energy-btn:hover {
          transform: translateY(-1px);
        }

        /* Energy form modal */
        .energy-form-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          max-width: 500px;
          width: 90%;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .modal-header h4 {
          margin: 0;
          color: #1f2937;
        }

        .current-emotion {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #64748b;
        }

        .energy-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-weight: 600;
          color: #374151;
          font-size: 0.875rem;
        }

        .energy-form select,
        .energy-form input {
          padding: 0.5rem;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          font-size: 1rem;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
        }

        .save-btn {
          background: #10b981;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        .cancel-btn {
          background: #e5e7eb;
          color: #374151;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        /* Existing styles */
        .breakdown-display h3 {
          margin: 0 0 1rem 0;
          color: #374151;
        }

        .steps-list {
          background: #f9fafb;
          border-radius: 8px;
          padding: 1rem;
        }

        .step-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: white;
          border-radius: 6px;
          margin-bottom: 0.5rem;
          border: 1px solid #e5e7eb;
          transition: all 0.3s ease;
        }

        .step-item.completed {
          background: #f0fdf4;
          border-color: #10b981;
          animation: fadeIn 0.3s ease;
        }

        .step-checkbox {
          width: 20px;
          height: 20px;
          margin-right: 1rem;
          cursor: pointer;
        }

        .step-title {
          font-weight: 500;
          color: #374151;
          flex: 1;
        }

        .step-title.completed {
          text-decoration: line-through;
          color: #6b7280;
          opacity: 0.7;
        }

        .step-time {
          color: #6b7280;
          font-size: 0.875rem;
          background: #eef2ff;
          padding: 0.25rem 0.5rem;
          border-radius: 999px;
        }

        .two-minute-btn {
          background: linear-gradient(135deg, #10b981, #14b8a6);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: transform 0.2s;
          box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
        }

        .two-minute-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(16, 185, 129, 0.4);
        }

        .global-two-minute {
          margin-top: 2rem;
          padding: 1.5rem;
          background: linear-gradient(135deg, #fef3c7, #fde68a);
          border: 2px solid #f59e0b;
          border-radius: 16px;
          text-align: center;
        }

        .global-two-minute-btn {
          background: linear-gradient(135deg, #f59e0b, #f97316);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-weight: 800;
          font-size: 1.25rem;
          cursor: pointer;
          transition: transform 0.2s;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
        }

        .global-two-minute-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(245, 158, 11, 0.6);
        }

        .global-two-minute-subtitle {
          margin: 1rem 0 0 0;
          color: #92400e;
          font-weight: 600;
          font-size: 1rem;
        }

        .timer-section {
          margin-top: 2rem;
          display: flex;
          justify-content: center;
        }

        @media (max-width: 640px) {
          .step-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .global-two-minute {
            padding: 1rem;
          }

          .global-two-minute-btn {
            font-size: 1rem;
            padding: 0.75rem 1.5rem;
          }

          .task-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .requirement-details {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};