import React, { useState } from 'react';
import { useAppState } from '../hooks/useAppState';

interface EmergencyDeadlineModeProps {
  className?: string;
}

export const EmergencyDeadlineMode: React.FC<EmergencyDeadlineModeProps> = ({ className = '' }) => {
  const {
    state,
    activateEmergencyMode,
    deactivateEmergencyMode,
    getEmergencyModeInfo,
    startEmergencyPomodoro,
    completeEmergencyReflection
  } = useAppState();

  const [showActivation, setShowActivation] = useState(false);
  const [customDeadline, setCustomDeadline] = useState('');
  const [reflection, setReflection] = useState('');
  const [showReflection, setShowReflection] = useState(false);

  const emergencyMode = getEmergencyModeInfo();

  const handleEmergencyActivation = (type: 'now' | 'custom') => {
    let deadline: Date;

    if (type === 'now') {
      // Emergency mode for next 2 hours
      deadline = new Date(Date.now() + 2 * 60 * 60 * 1000);
    } else {
      // Custom deadline
      const deadlineDate = new Date(customDeadline);
      if (isNaN(deadlineDate.getTime())) {
        alert('Please enter a valid date and time');
        return;
      }
      deadline = deadlineDate;
    }

    activateEmergencyMode(deadline);
    setShowActivation(false);
  };

  const handleEmergencyCompletion = () => {
    setShowReflection(true);
  };

  const handleReflectionSubmit = () => {
    if (reflection.trim()) {
      completeEmergencyReflection(reflection);
      setReflection('');
      setShowReflection(false);
    }
  };

  const handleStartPomodoro = () => {
    if (emergencyMode.essentialTasks.length > 0) {
      startEmergencyPomodoro(emergencyMode.essentialTasks);
    }
  };

  // If not in emergency mode, show activation button
  if (!emergencyMode.isEmergency) {
    return (
      <div className={`emergency-mode-container ${className}`}>
        <div className="emergency-mode-calm">
          <h3>Emergency Deadline Mode 🚨</h3>
          <p>When you're facing an imminent deadline and need to triage and execute under pressure without judgment.</p>

          <div className="emergency-actions">
            <button
              className="btn-emergency-quick"
              onClick={() => handleEmergencyActivation('now')}
            >
              Emergency Mode (2 hours)
            </button>

            <button
              className="btn-emergency-custom"
              onClick={() => setShowActivation(!showActivation)}
            >
              Custom Deadline
            </button>

            {showActivation && (
              <div className="emergency-form">
                <input
                  type="datetime-local"
                  value={customDeadline}
                  onChange={(e) => setCustomDeadline(e.target.value)}
                  className="deadline-input"
                />
                <div className="form-actions">
                  <button
                    className="btn-primary"
                    onClick={() => handleEmergencyActivation('custom')}
                  >
                    Activate Emergency Mode
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => setShowActivation(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="emergency-benefits">
            <h4>What this does:</h4>
            <ul>
              <li>🚨 One-click activation for crisis situations</li>
              <li>⚡ Rapid assessment of what's actually due</li>
              <li>🎯 Shows only essential tasks with time-boxing</li>
              <li>⏰ Pomodoro timer with enforced breaks</li>
              <li>💭 Post-crisis reflection for improvement</li>
            </ul>
          </div>
        </div>

        <style>{`
          .emergency-mode-container {
            background: linear-gradient(135deg, #fff5f5 0%, #fff1f2 100%);
            border: 2px solid #fecaca;
            border-radius: 16px;
            padding: 2rem;
            margin: 1rem 0;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }

          .emergency-mode-calm h3 {
            color: #dc2626;
            margin-top: 0;
            font-size: 1.5rem;
          }

          .emergency-mode-calm p {
            color: #7f1d1d;
            margin-bottom: 1.5rem;
            line-height: 1.6;
          }

          .emergency-actions {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
            margin-bottom: 2rem;
          }

          .btn-emergency-quick {
            background: #dc2626;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 0 2px 4px rgba(220, 38, 38, 0.3);
          }

          .btn-emergency-quick:hover {
            background: #b91c1c;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(220, 38, 38, 0.4);
          }

          .btn-emergency-custom {
            background: #fef2f2;
            color: #dc2626;
            border: 2px solid #fecaca;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
          }

          .btn-emergency-custom:hover {
            background: #fecaca;
          }

          .emergency-form {
            background: white;
            padding: 1.5rem;
            border-radius: 12px;
            border: 1px solid #fecaca;
            width: 100%;
            max-width: 400px;
          }

          .deadline-input {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            font-size: 1rem;
            margin-bottom: 1rem;
          }

          .form-actions {
            display: flex;
            gap: 1rem;
          }

          .btn-primary {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
          }

          .btn-secondary {
            background: #f3f4f6;
            color: #374151;
            border: 1px solid #d1d5db;
            padding: 0.75rem 1.5rem;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
          }

          .emergency-benefits h4 {
            color: #7f1d1d;
            margin-bottom: 0.5rem;
          }

          .emergency-benefits ul {
            color: #7f1d1d;
            padding-left: 1.5rem;
            line-height: 1.8;
          }

          .emergency-benefits li {
            margin-bottom: 0.5rem;
          }
        `}</style>
      </div>
    );
  }

  // If in emergency mode, show the emergency interface
  return (
    <div className={`emergency-mode-active ${className}`}>
      <div className="emergency-header">
        <div className="emergency-status">
          <h3>🚨 Emergency Mode Active</h3>
          <div className="time-remaining">
            Time until deadline: <strong>{emergencyMode.timeLeftFormatted}</strong>
          </div>
          <div className="deadline-info">
            Deadline: {emergencyMode.deadline?.toLocaleString()}
          </div>
        </div>

        <div className="emergency-controls">
          <button
            className="btn-stop-emergency"
            onClick={handleEmergencyCompletion}
          >
            Complete Emergency Session
          </button>
        </div>
      </div>

      <div className="emergency-content">
        <div className="emergency-assessment">
          <h4>📋 Rapid Assessment</h4>
          <div className="assessment-grid">
            <div className="assessment-item">
              <span className="label">Total Tasks:</span>
              <span className="value">{state.tasks.length}</span>
            </div>
            <div className="assessment-item">
              <span className="label">Essential Tasks:</span>
              <span className="value">{emergencyMode.essentialTasks.length}</span>
            </div>
            <div className="assessment-item">
              <span className="label">Time Available:</span>
              <span className="value">{emergencyMode.timeLeftFormatted}</span>
            </div>
          </div>
        </div>

        <div className="emergency-tasks">
          <h4>🎯 Essential Tasks Only</h4>
          {emergencyMode.essentialTasks.length > 0 ? (
            <div className="essential-task-list">
              {emergencyMode.essentialTasks.map((taskId, index) => (
                <div key={taskId} className="essential-task-item">
                  <span className="task-number">Task {index + 1}</span>
                  <span className="task-text">Focus on critical task</span>
                  <button
                    className="btn-start-pomodoro"
                    onClick={handleStartPomodoro}
                  >
                    Start 2-Minute Focus
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-essential-tasks">
              <p>✅ No urgent tasks found. You're in a good position!</p>
              <p>Use this time for important but not urgent work, or take a well-deserved break.</p>
            </div>
          )}
        </div>

        <div className="emergency-tips">
          <h4>💡 Emergency Mode Features</h4>
          <ul>
            <li>⏰ Time-boxing enabled: Use focused 2-minute intervals</li>
            <li>🚫 No distractions: Only essential tasks shown</li>
            <li>🔄 Enforced breaks: Take short breaks to maintain focus</li>
            <li>🎯 Progress tracking: See what you accomplish</li>
            <li>💭 Reflection ready: Post-crisis learning</li>
          </ul>
        </div>
      </div>

      {showReflection && (
        <div className="emergency-reflection">
          <h4>💭 Post-Crisis Reflection</h4>
          <p>What could prevent this next time? Take 2 minutes to reflect.</p>

          <textarea
            className="reflection-textarea"
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Reflect on what worked, what didn't, and how to prevent this situation next time..."
            rows={4}
          />

          <div className="reflection-actions">
            <button
              className="btn-submit-reflection"
              onClick={handleReflectionSubmit}
            >
              Submit Reflection
            </button>
            <button
              className="btn-cancel-reflection"
              onClick={() => {
                setShowReflection(false);
                deactivateEmergencyMode();
              }}
            >
              Skip Reflection
            </button>
          </div>
        </div>
      )}

      <style>{`
        .emergency-mode-active {
          background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
          border: 2px solid #fecaca;
          border-radius: 16px;
          padding: 2rem;
          margin: 1rem 0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .emergency-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #fecaca;
        }

        .emergency-status h3 {
          color: #dc2626;
          margin: 0 0 0.5rem 0;
          font-size: 1.5rem;
        }

        .time-remaining {
          color: #7f1d1d;
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
        }

        .time-remaining strong {
          font-weight: 800;
          color: #dc2626;
        }

        .deadline-info {
          color: #7f1d1d;
          font-size: 0.9rem;
        }

        .btn-stop-emergency {
          background: #dc2626;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-stop-emergency:hover {
          background: #b91c1c;
          transform: translateY(-1px);
        }

        .emergency-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        @media (max-width: 768px) {
          .emergency-content {
            grid-template-columns: 1fr;
          }

          .emergency-header {
            flex-direction: column;
            gap: 1rem;
          }
        }

        .emergency-assessment, .emergency-tasks, .emergency-tips {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          border: 1px solid #fecaca;
        }

        .assessment-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-top: 1rem;
        }

        .assessment-item {
          background: #fef2f2;
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid #fecaca;
        }

        .label {
          display: block;
          color: #7f1d1d;
          font-size: 0.8rem;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .value {
          color: #dc2626;
          font-size: 1.2rem;
          font-weight: 800;
        }

        .essential-task-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .essential-task-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
        }

        .task-number {
          background: #dc2626;
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 700;
        }

        .task-text {
          color: #7f1d1d;
          font-weight: 600;
        }

        .btn-start-pomodoro {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
        }

        .no-essential-tasks {
          text-align: center;
          color: #16a34a;
          padding: 2rem;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 8px;
        }

        .emergency-tips ul {
          color: #7f1d1d;
          padding-left: 1.5rem;
          line-height: 1.8;
        }

        .emergency-reflection {
          margin-top: 2rem;
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          border: 1px solid #fecaca;
        }

        .reflection-textarea {
          width: 100%;
          padding: 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-family: inherit;
          font-size: 1rem;
          margin: 1rem 0 1.5rem 0;
        }

        .reflection-actions {
          display: flex;
          gap: 1rem;
        }

        .btn-submit-reflection {
          background: #22c55e;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-cancel-reflection {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};