import React, { useState } from 'react';
import { Task, MicroStep } from '../types';
import { useAppState } from '../hooks/useAppState';

interface TaskBreakdownAssistantProps {
  task: Task;
}

export const TaskBreakdownAssistant: React.FC<TaskBreakdownAssistantProps> = ({ task }) => {
  const { generateBreakdown, acceptBreakdown, rejectBreakdown, modifyBreakdown, getCurrentBreakdown } = useAppState();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const breakdown = getCurrentBreakdown(task.id);

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

  if (breakdown && breakdown.isAccepted) {
    return (
      <div className="breakdown-display">
        <h3>Task Breakdown</h3>
        <div className="steps-list">
          {breakdown.microSteps.map(step => (
            <div key={step.id} className="step-item">
              <span className="step-title">{step.title}</span>
              <span className="step-time">(~{step.estimatedTime} min)</span>
            </div>
          ))}
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

      <style jsx>{`
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
        }

        .step-title {
          font-weight: 500;
          color: #374151;
        }

        .step-time {
          color: #6b7280;
          font-size: 0.875rem;
          background: #eef2ff;
          padding: 0.25rem 0.5rem;
          border-radius: 999px;
        }
      `}</style>
    </div>
  );
};