import React from 'react';
import { useAppState } from '../hooks/useAppState';

interface SmartTaskFilterProps {
  className?: string;
}

export const SmartTaskFilter: React.FC<SmartTaskFilterProps> = ({ className = '' }) => {
  const { getSmartTaskFilter, setTaskEnergyRequirement, getTaskEnergyRequirement } = useAppState();
  const filter = getSmartTaskFilter();

  const handleSetEnergyRequirement = (taskId: string, energyLevel: 'low' | 'medium' | 'high', focusType: 'creative' | 'analytical' | 'routine' | 'mental' | 'physical', estimatedTime: number) => {
    setTaskEnergyRequirement(taskId, energyLevel, focusType, estimatedTime);
  };

  const getEnergyColor = (level: string) => {
    switch (level) {
      case 'low': return '#22c55e'; // Green
      case 'medium': return '#f59e0b'; // Orange
      case 'high': return '#ef4444'; // Red
      default: return '#6b7280'; // Gray
    }
  };

  const getFocusTypeIcon = (focusType: string) => {
    switch (focusType) {
      case 'creative': return '🎨';
      case 'analytical': return '🧮';
      case 'routine': return '📋';
      case 'mental': return '🧠';
      case 'physical': return '💪';
      default: return '❓';
    }
  };

  return (
    <div className={`smart-task-filter ${className}`}>
      <div className="filter-header">
        <h4>Smart Task Filter</h4>
        <p className="filter-subtitle">
          {filter.currentEmotion
            ? `Based on your ${filter.currentEmotion.emotion} state (${filter.currentEmotion.intensity}/10)`
            : "Set your emotion to see personalized task matching"}
        </p>
      </div>

      {filter.currentEmotion && (
        <div className="current-state-info">
          <div className="state-badge">
            <span className="state-emoji">🧠</span>
            <span className="state-text">{filter.energyOptimization}</span>
          </div>
        </div>
      )}

      <div className="task-sections">
        <div className="task-section">
          <h5>Tasks That Match Your Current State</h5>
          {filter.matchingTasks.length > 0 ? (
            <div className="task-list">
              {filter.matchingTasks.map((task: any) => {
                const requirement = getTaskEnergyRequirement(task.id);
                return (
                  <div key={task.id} className="task-item">
                    <div className="task-content">
                      <h6>{task.title}</h6>
                      {task.description && <p className="task-description">{task.description}</p>}
                      {requirement && (
                        <div className="task-meta">
                          <span
                            className="energy-badge"
                            style={{ borderColor: getEnergyColor(requirement.energyLevel) }}
                          >
                            {getFocusTypeIcon(requirement.focusType)} {requirement.energyLevel.toUpperCase()}
                          </span>
                          <span className="time-estimate">{requirement.estimatedTime || 0} min</span>
                        </div>
                      )}
                    </div>
                    <EnergyRequirementForm
                      taskId={task.id}
                      currentRequirement={requirement}
                      onSetRequirement={handleSetEnergyRequirement}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-matching-tasks">
              <p>No tasks match your current state. Try:</p>
              <ul>
                <li>Setting your emotion</li>
                <li>Adding energy requirements to tasks</li>
                <li>Trying a different emotion state</li>
              </ul>
            </div>
          )}
        </div>

        {filter.suggestedAlternatives.length > 0 && (
          <div className="task-section">
            <h5>Suggested Alternatives</h5>
            <div className="task-list">
              {filter.suggestedAlternatives.map((task: any) => (
                <div key={task.id} className="task-item alternative">
                  <div className="task-content">
                    <h6>{task.title}</h6>
                    {task.description && <p className="task-description">{task.description}</p>}
                    <span className="alternative-badge">Gentle Option</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .smart-task-filter {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          border: 1px solid #e2e8f0;
        }

        .filter-header h4 {
          margin: 0 0 0.5rem 0;
          font-size: 1rem;
          color: #1e293b;
        }

        .filter-subtitle {
          margin: 0;
          color: #64748b;
          font-size: 0.9rem;
        }

        .current-state-info {
          margin: 1rem 0;
        }

        .state-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #f1f5f9;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
        }

        .state-emoji {
          font-size: 1.2rem;
        }

        .state-text {
          font-weight: 600;
          color: #1e293b;
        }

        .task-sections {
          display: grid;
          gap: 2rem;
        }

        .task-section h5 {
          margin: 0 0 1rem 0;
          color: #334155;
          font-size: 0.9rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .task-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .task-item {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 1rem;
          align-items: center;
          padding: 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: #fafafa;
        }

        .task-item.alternative {
          border-color: #f59e0b;
          background: #fffbeb;
        }

        .task-content h6 {
          margin: 0 0 0.25rem 0;
          color: #1e293b;
        }

        .task-description {
          margin: 0 0 0.5rem 0;
          color: #64748b;
          font-size: 0.9rem;
        }

        .task-meta {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .energy-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          background: white;
        }

        .time-estimate {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 600;
        }

        .alternative-badge {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          background: #f59e0b;
          color: white;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .no-matching-tasks {
          padding: 1rem;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
        }

        .no-matching-tasks p {
          margin: 0 0 1rem 0;
          color: #dc2626;
          font-weight: 600;
        }

        .no-matching-tasks ul {
          margin: 0;
          padding-left: 1.5rem;
          color: #7f1d1d;
        }

        .no-matching-tasks li {
          margin-bottom: 0.25rem;
        }
      `}</style>
    </div>
  );
};

// Energy Requirement Form Component
const EnergyRequirementForm: React.FC<{
  taskId: string;
  currentRequirement: any;
  onSetRequirement: (taskId: string, energyLevel: 'low' | 'medium' | 'high', focusType: 'creative' | 'analytical' | 'routine' | 'mental' | 'physical', estimatedTime: number) => void;
}> = ({ taskId, currentRequirement, onSetRequirement }) => {
  const [energyLevel, setEnergyLevel] = React.useState<'low' | 'medium' | 'high'>(currentRequirement?.energyLevel || 'medium');
  const [focusType, setFocusType] = React.useState<'creative' | 'analytical' | 'routine' | 'mental' | 'physical'>(currentRequirement?.focusType || 'routine');
  const [estimatedTime, setEstimatedTime] = React.useState<number>(currentRequirement?.estimatedTime || 10);

  React.useEffect(() => {
    if (currentRequirement) {
      setEnergyLevel(currentRequirement.energyLevel);
      setFocusType(currentRequirement.focusType);
      setEstimatedTime(currentRequirement.estimatedTime);
    }
  }, [currentRequirement]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSetRequirement(taskId, energyLevel, focusType, estimatedTime);
  };

  return (
    <form onSubmit={handleSubmit} className="energy-form">
      <div className="form-group">
        <label htmlFor={`energy-${taskId}`}>Energy Level</label>
        <select
          id={`energy-${taskId}`}
          value={energyLevel}
          onChange={(e) => setEnergyLevel(e.target.value as any)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor={`focus-${taskId}`}>Focus Type</label>
        <select
          id={`focus-${taskId}`}
          value={focusType}
          onChange={(e) => setFocusType(e.target.value as any)}
        >
          <option value="routine">Routine 📋</option>
          <option value="analytical">Analytical 🧮</option>
          <option value="creative">Creative 🎨</option>
          <option value="mental">Mental 🧠</option>
          <option value="physical">Physical 💪</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor={`time-${taskId}`}>Time (min)</label>
        <input
          id={`time-${taskId}`}
          type="number"
          min="1"
          max="240"
          value={estimatedTime}
          onChange={(e) => setEstimatedTime(parseInt(e.target.value))}
        />
      </div>
      <button type="submit" className="save-btn">Save</button>
      <style>{`
        .energy-form {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          min-width: 200px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .form-group label {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 600;
        }

        .form-group select,
        .form-group input {
          padding: 0.25rem;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          font-size: 0.875rem;
        }

        .save-btn {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          align-self: flex-end;
        }

        .save-btn:hover {
          background: #2563eb;
        }
      `}</style>
    </form>
  );
};