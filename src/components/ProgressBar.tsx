import React from 'react';
import { ProgressState } from '../types';

interface ProgressBarProps {
  progress: ProgressState;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, className = '' }) => {
  const totalSteps = progress.totalStepsCompleted;
  const targetSteps = Math.max(10, totalSteps + 1); // Dynamic target that grows
  const percentage = Math.min((totalSteps / targetSteps) * 100, 100);

  return (
    <div className={`progress-bar-container ${className}`}>
      <div className="progress-header">
        <h3>Your Progress Journey</h3>
        <div className="progress-stats">
          <span className="stat-item">
            <span className="stat-label">Today:</span>
            <span className="stat-value">{progress.dailyStats[progress.dailyStats.length - 1]?.stepsCompleted || 0}</span>
          </span>
          <span className="stat-item">
            <span className="stat-label">Streak:</span>
            <span className="stat-value streak-value">{progress.currentStreak}</span>
          </span>
          <span className="stat-item">
            <span className="stat-label">Total:</span>
            <span className="stat-value">{totalSteps}</span>
          </span>
        </div>
      </div>

      <div className="progress-track">
        <div
          className="progress-fill"
          style={{
            width: `${percentage}%`,
            transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />
      </div>

      <div className="progress-labels">
        <span className="label-left">Small Steps</span>
        <span className="label-right">Big Wins</span>
      </div>

      <style>{`
        .progress-bar-container {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .progress-header h3 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: #1f2937;
        }

        .progress-stats {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          padding: 0.5rem;
          border-radius: 8px;
          background: #f9fafb;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .stat-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
        }

        .streak-value {
          color: #22c55e;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        .progress-track {
          height: 12px;
          background: #e5e7eb;
          border-radius: 999px;
          overflow: hidden;
          margin: 1rem 0;
          position: relative;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #22c55e);
          border-radius: 999px;
          position: relative;
          overflow: hidden;
        }

        .progress-fill::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.2) 0%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .progress-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .label-left {
          font-weight: 500;
        }

        .label-right {
          font-weight: 600;
          color: #1f2937;
        }
      `}</style>
    </div>
  );
};