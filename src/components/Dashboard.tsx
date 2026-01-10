import React, { useState } from 'react';
import { useAppState } from '../hooks/useAppState';
import { TaskBreakdownAssistant } from './TaskBreakdownAssistant';
import { ProgressDashboard } from './ProgressDashboard';
import { AntiPerfectionismMode } from './AntiPerfectionismMode';
import { ProcrastinationInsights } from './ProcrastinationInsights';
import { ContextPreservation } from './ContextPreservation';
import { EmotionSelector } from './EmotionSelector';
import { SmartTaskFilter } from './SmartTaskFilter';
import { ProcrastinationFriendlyReminders } from './ProcrastinationFriendlyReminders';
import { EmergencyDeadlineMode } from './EmergencyDeadlineMode';

export const Dashboard: React.FC = () => {
  const { state, addTask, deleteTask } = useAppState();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle.trim(), newTaskDescription.trim() || undefined);
      setNewTaskTitle('');
      setNewTaskDescription('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleAddTask(e as any);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <div className="left-column">
          <AntiPerfectionismMode className="anti-perfectionism-section" />

          <EmotionSelector className="emotion-section" />

          <div className="add-task-section">
            <h2>Add a task to break down</h2>
            <p>Enter any overwhelming task and our AI will help you break it into tiny, manageable steps.</p>

            <form onSubmit={handleAddTask} className="task-form">
              <div className="form-group">
                <label htmlFor="task-title">What do you need to do?</label>
                <input
                  id="task-title"
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g., Write research paper, Organize closet, Learn to cook"
                  className="task-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="task-description">Any details? (optional)</label>
                <textarea
                  id="task-description"
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Additional context or requirements..."
                  className="task-textarea"
                  rows={3}
                />
              </div>

              <button type="submit" className="add-task-btn" disabled={!newTaskTitle.trim()}>
                Add Task
              </button>
            </form>
          </div>

          {state.tasks.length > 0 && (
            <div className="tasks-section">
              <h2>Your Tasks</h2>

              <div className="tasks-grid">
                {state.tasks.map(task => (
                  <div key={task.id} className="task-card">
                    <div className="task-header">
                      <h3>{task.title}</h3>
                      {task.description && (
                        <p className="task-description">{task.description}</p>
                      )}
                      <div className="task-meta">
                        <span className="task-date">Added {task.createdAt.toLocaleDateString()}</span>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="delete-btn"
                          aria-label="Delete task"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <TaskBreakdownAssistant task={task} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="right-column">
          <ProgressDashboard progress={state.progress} />

          <EmergencyDeadlineMode className="emergency-section" />

          <ProcrastinationFriendlyReminders className="reminders-section" />

          <SmartTaskFilter className="smart-filter-section" />

          <ProcrastinationInsights className="insights-section" />

          <ContextPreservation className="context-section" taskId={state.tasks[0]?.id || ''} />
        </div>
      </div>

      <style>{`
        .dashboard {
          max-width: 1200px;
          margin: 0 auto;
        }

        .dashboard-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
        }

        .left-column {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .right-column {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .anti-perfectionism-section {
          margin-bottom: 0;
        }

        .emotion-section {
          margin-bottom: 0;
        }

        .emergency-section {
          margin-bottom: 0;
        }

        .insights-section {
          margin-bottom: 0;
        }

        .context-section {
          margin-bottom: 0;
        }

        .smart-filter-section {
          margin-bottom: 0;
        }

        .reminders-section {
          margin-bottom: 0;
        }

        .add-task-section {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .add-task-section h2 {
          margin: 0 0 0.5rem 0;
          color: #1f2937;
        }

        .add-task-section p {
          margin: 0 0 2rem 0;
          color: #6b7280;
          font-size: 1.1rem;
        }

        .task-form {
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

        .task-input, .task-textarea {
          padding: 0.75rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }

        .task-input:focus, .task-textarea:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .add-task-btn {
          align-self: flex-start;
          background: linear-gradient(135deg, #6366f1, #10b981);
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .add-task-btn:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        .add-task-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .tasks-section {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .tasks-section h2 {
          margin: 0 0 2rem 0;
          color: #1f2937;
        }

        .tasks-grid {
          display: grid;
          gap: 1.5rem;
        }

        .task-card {
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 1.5rem;
          transition: box-shadow 0.2s;
        }

        .task-card:hover {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .task-header h3 {
          margin: 0 0 0.5rem 0;
          color: #1f2937;
          font-size: 1.25rem;
        }

        .task-description {
          margin: 0 0 1rem 0;
          color: #6b7280;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .task-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
        }

        .task-date {
          color: #9ca3af;
          font-size: 0.875rem;
        }

        .delete-btn {
          background: #fee2e2;
          color: #dc2626;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .delete-btn:hover {
          background: #fecaca;
        }

        @media (max-width: 768px) {
          .dashboard-content {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};