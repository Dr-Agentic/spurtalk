import React, { useState } from 'react';
import { useAppState } from '../hooks/useAppState';

interface ContextPreservationProps {
  taskId: string;
  className?: string;
}

export const ContextPreservation: React.FC<ContextPreservationProps> = ({
  taskId,
  className = ''
}) => {
  const {
    addContextNote,
    getPreviousContext,
    getTimelineView,
    startWorkSession,
    endWorkSession,
    getCurrentSession
  } = useAppState();

  const [contextNote, setContextNote] = useState('');
  const [showTimeline, setShowTimeline] = useState(false);

  const previousContext = getPreviousContext(taskId);
  const timeline = getTimelineView(taskId);
  const currentSession = getCurrentSession(taskId);

  const handleAddNote = () => {
    if (contextNote.trim()) {
      addContextNote(taskId, null, contextNote.trim());
      setContextNote('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleAddNote();
    }
  };

  const handleStartSession = () => {
    startWorkSession(taskId);
  };

  const handleEndSession = () => {
    if (currentSession) {
      endWorkSession(currentSession.id, contextNote || "Session ended");
    }
  };

  return (
    <div className={`context-preservation ${className}`}>
      <div className="context-header">
        <h4>Context Preservation</h4>
        <p className="context-subtitle">Remember where you were and what you were thinking</p>
      </div>

      {/* Current Session Status */}
      {currentSession ? (
        <div className="current-session">
          <div className="session-info">
            <span className="session-label">Current Session:</span>
            <span className="session-time">
              Started {new Date(currentSession.startTime).toLocaleTimeString()}
            </span>
            <button
              className="end-session-btn"
              onClick={handleEndSession}
            >
              End Session
            </button>
          </div>
        </div>
      ) : (
        <div className="session-actions">
          <button
            className="start-session-btn"
            onClick={handleStartSession}
          >
            🎯 Start Work Session
          </button>
        </div>
      )}

      {/* Quick Context Note */}
      <div className="context-note-section">
        <h5>Quick Note</h5>
        <div className="note-input-group">
          <textarea
            className="context-note-input"
            placeholder="What were you about to do next? Any important details to remember?"
            value={contextNote}
            onChange={(e) => setContextNote(e.target.value)}
            onKeyPress={handleKeyPress}
            rows={3}
          />
          <button
            className="add-note-btn"
            onClick={handleAddNote}
            disabled={!contextNote.trim()}
          >
            Save Note
          </button>
        </div>
      </div>

      {/* Previous Context Display */}
      {previousContext && (
        <div className="previous-context">
          <h5>Last Session</h5>
          <div className="context-card">
            <div className="context-meta">
              <span className="context-time">
                {new Date(previousContext.timestamp).toLocaleString()}
              </span>
              {previousContext.stepId && (
                <span className="context-step">Step: {previousContext.stepId}</span>
              )}
            </div>
            <p className="context-content">{previousContext.contextNotes}</p>
            <div className="context-actions">
              <button
                className="resume-btn"
                onClick={() => addContextNote(taskId, previousContext.stepId, "Resuming from last session")}
              >
                Resume from Here
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Timeline View Toggle */}
      <div className="timeline-toggle">
        <button
          className="timeline-btn"
          onClick={() => setShowTimeline(!showTimeline)}
        >
          {showTimeline ? 'Hide' : 'Show'} Timeline
        </button>
      </div>

      {/* Timeline View */}
      {showTimeline && timeline.length > 0 && (
        <div className="timeline-view">
          <h5>Work Timeline</h5>
          <div className="timeline-list">
            {timeline.map(snapshot => (
              <div key={snapshot.id} className="timeline-item">
                <div className="timeline-header">
                  <span className="timeline-time">
                    {new Date(snapshot.timestamp).toLocaleString()}
                  </span>
                  {snapshot.stepId && (
                    <span className="timeline-step">Step: {snapshot.stepId}</span>
                  )}
                </div>
                <p className="timeline-note">{snapshot.contextNotes}</p>
                <div className="timeline-actions">
                  <button
                    className="use-context-btn"
                    onClick={() => addContextNote(taskId, snapshot.stepId, "Using context from previous session")}
                  >
                    Use This Context
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!previousContext && !currentSession && (
        <div className="context-empty">
          <div className="empty-icon">🧠</div>
          <h5>Start Tracking Your Context</h5>
          <p>Take notes about what you're working on so you can easily pick up where you left off.</p>
          <div className="empty-actions">
            <button
              className="start-session-btn"
              onClick={handleStartSession}
            >
              Start Your First Session
            </button>
          </div>
        </div>
      )}

      <style>{`
        .context-preservation {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .context-header {
          margin-bottom: 1.5rem;
          border-bottom: 2px solid #f3f4f6;
          padding-bottom: 1rem;
        }

        .context-header h4 {
          margin: 0 0 0.5rem 0;
          color: #1f2937;
          font-size: 1.25rem;
        }

        .context-subtitle {
          margin: 0;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .session-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          background: #f8fafc;
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .session-label {
          font-weight: 600;
          color: #374151;
        }

        .session-time {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .end-session-btn {
          background: #ef4444;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        .end-session-btn:hover {
          background: #dc2626;
        }

        .start-session-btn {
          background: #22c55e;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 1rem;
          transition: background-color 0.2s;
        }

        .start-session-btn:hover {
          background: #16a34a;
        }

        .context-note-section {
          margin: 1.5rem 0;
        }

        .context-note-section h5 {
          margin: 0 0 1rem 0;
          color: #374151;
          font-size: 1rem;
        }

        .note-input-group {
          display: flex;
          gap: 1rem;
          align-items: flex-end;
        }

        .context-note-input {
          flex: 1;
          padding: 0.75rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.875rem;
          resize: vertical;
          transition: border-color 0.2s;
        }

        .context-note-input:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .add-note-btn {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: background-color 0.2s;
          opacity: 0.7;
          cursor: not-allowed;
        }

        .add-note-btn:not(:disabled) {
          opacity: 1;
          cursor: pointer;
        }

        .add-note-btn:not(:disabled):hover {
          background: #2563eb;
        }

        .previous-context {
          margin: 1.5rem 0;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .previous-context h5 {
          margin: 0 0 1rem 0;
          color: #374151;
          font-size: 1rem;
        }

        .context-card {
          background: white;
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .context-meta {
          display: flex;
          gap: 1rem;
          margin-bottom: 0.5rem;
          align-items: center;
        }

        .context-time {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .context-step {
          font-size: 0.875rem;
          color: #3b82f6;
          background: #eff6ff;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          border: 1px solid #bfdbfe;
        }

        .context-content {
          margin: 0 0 1rem 0;
          color: #374151;
          line-height: 1.5;
        }

        .context-actions {
          display: flex;
          gap: 1rem;
        }

        .resume-btn {
          background: #f59e0b;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        .resume-btn:hover {
          background: #d97706;
        }

        .timeline-toggle {
          margin: 1.5rem 0;
          text-align: center;
        }

        .timeline-btn {
          background: #9ca3af;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        .timeline-btn:hover {
          background: #6b7280;
        }

        .timeline-view {
          margin-top: 1.5rem;
          border-top: 2px solid #f3f4f6;
          padding-top: 1.5rem;
        }

        .timeline-view h5 {
          margin: 0 0 1rem 0;
          color: #374151;
          font-size: 1rem;
        }

        .timeline-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .timeline-item {
          background: white;
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .timeline-header {
          display: flex;
          gap: 1rem;
          margin-bottom: 0.5rem;
          align-items: center;
        }

        .timeline-time {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .timeline-step {
          font-size: 0.875rem;
          color: #3b82f6;
          background: #eff6ff;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          border: 1px solid #bfdbfe;
        }

        .timeline-note {
          margin: 0 0 1rem 0;
          color: #374151;
          line-height: 1.5;
        }

        .timeline-actions {
          display: flex;
          gap: 1rem;
        }

        .use-context-btn {
          background: #8b5cf6;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        .use-context-btn:hover {
          background: #7c3aed;
        }

        .context-empty {
          text-align: center;
          padding: 2rem;
          color: #6b7280;
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .context-empty h5 {
          margin: 0 0 0.5rem 0;
          color: #374151;
          font-size: 1.125rem;
        }

        .empty-actions {
          margin-top: 1.5rem;
        }
      `}</style>
    </div>
  );
};