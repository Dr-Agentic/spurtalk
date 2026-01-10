import React, { useEffect, useState } from 'react';
import { useAppState } from '../hooks/useAppState';

interface TwoMinuteTimerProps {
  taskId: string;
  stepId?: string;
  onCompletion: (keepGoing: boolean) => void;
}

export const TwoMinuteTimer: React.FC<TwoMinuteTimerProps> = ({
  taskId,
  stepId,
  onCompletion
}) => {
  const {
    state,
    stopTimer,
    pauseTimer,
    getRemainingTime,
    getTimerProgress,
    isTimerFinished
  } = useAppState();

  const [showCompletionPrompt, setShowCompletionPrompt] = useState(false);

  // Format time display
  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.ceil(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Update timer display
  useEffect(() => {
    const timer = setInterval(() => {
      if (isTimerFinished()) {
        setShowCompletionPrompt(true);
        stopTimer();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerFinished, stopTimer]);

  const handleKeepGoing = () => {
    setShowCompletionPrompt(false);
    onCompletion(true);
  };

  const handleStop = () => {
    setShowCompletionPrompt(false);
    onCompletion(false);
  };

  const progress = getTimerProgress();
  const remainingTime = getRemainingTime();

  // Check if this timer is active for this task/step
  const isCurrentTimer = state.timer.currentTaskId === taskId &&
    (stepId ? state.timer.currentStepId === stepId : true);

  if (!isCurrentTimer) {
    return null;
  }

  return (
    <div className="two-minute-timer">
      {showCompletionPrompt ? (
        <div className="completion-prompt">
          <h3>Time's up! 🎉</h3>
          <p>Great job completing 2 minutes! How would you like to proceed?</p>
          <div className="completion-actions">
            <button onClick={handleKeepGoing} className="keep-going-btn">
              Keep going! I'm in the zone
            </button>
            <button onClick={handleStop} className="done-btn">
              Great job! Done for now
            </button>
          </div>
        </div>
      ) : (
        <div className="timer-display">
          <div className="timer-circle">
            <svg width="200" height="200" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="10"
              />
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="#10b981"
                strokeWidth="10"
                strokeDasharray={`${2 * Math.PI * 90}`}
                strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress)}`}
                strokeLinecap="round"
                transform="rotate(-90 100 100)"
              />
            </svg>
            <div className="timer-text">
              <div className="time">{formatTime(remainingTime)}</div>
              <div className="label">Just 2 minutes</div>
            </div>
          </div>

          <div className="timer-controls">
            <button
              onClick={pauseTimer}
              className="control-btn pause-btn"
            >
              Pause
            </button>
            <button
              onClick={stopTimer}
              className="control-btn stop-btn"
            >
              Stop
            </button>
          </div>

          <div className="encouragement">
            <p>You've got this! Just focus for these 2 minutes.</p>
            <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>
              No pressure - even stopping after 2 minutes is a win! 🌟
            </p>
          </div>
        </div>
      )}

      <style>{`
        .two-minute-timer {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          text-align: center;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          border: 2px solid #10b981;
          max-width: 400px;
          margin: 0 auto;
        }

        .completion-prompt {
          animation: fadeIn 0.3s ease-in;
        }

        .completion-prompt h3 {
          margin: 0 0 0.5rem 0;
          color: #10b981;
          font-size: 1.5rem;
        }

        .completion-prompt p {
          margin: 0 0 1.5rem 0;
          color: #374151;
          font-size: 1rem;
        }

        .completion-actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .keep-going-btn {
          background: linear-gradient(135deg, #10b981, #3b82f6);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1.1rem;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .keep-going-btn:hover {
          transform: translateY(-2px);
        }

        .done-btn {
          background: #f3f4f6;
          color: #374151;
          border: 2px solid #e5e7eb;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .done-btn:hover {
          background: #e5e7eb;
          border-color: #d1d5db;
        }

        .timer-display {
          animation: fadeIn 0.3s ease-in;
        }

        .timer-circle {
          position: relative;
          margin-bottom: 2rem;
        }

        .timer-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }

        .time {
          font-size: 2rem;
          font-weight: 800;
          color: #111827;
          font-family: 'Courier New', monospace;
        }

        .label {
          font-size: 0.875rem;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .timer-controls {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .control-btn {
          padding: 0.5rem 1rem;
          border-radius: 8px;
          border: 2px solid #e5e7eb;
          background: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .control-btn:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        .pause-btn:hover {
          background: #fef3c7;
          border-color: #f59e0b;
        }

        .stop-btn:hover {
          background: #fee2e2;
          border-color: #ef4444;
        }

        .encouragement {
          background: #f0fdf4;
          border: 1px solid #dcfce7;
          border-radius: 12px;
          padding: 1rem;
          color: #166534;
        }

        .encouragement p {
          margin: 0 0 0.5rem 0;
          font-weight: 600;
        }

        .encouragement p:last-child {
          margin-bottom: 0;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 480px) {
          .two-minute-timer {
            padding: 1.5rem;
            margin: 0 1rem;
          }

          .timer-circle svg {
            width: 150px;
            height: 150px;
          }

          .timer-text .time {
            font-size: 1.5rem;
          }

          .completion-actions {
            gap: 0.75rem;
          }

          .keep-going-btn, .done-btn {
            padding: 0.75rem 1.5rem;
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};