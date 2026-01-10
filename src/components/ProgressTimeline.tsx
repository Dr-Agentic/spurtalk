import React from 'react';
import { ProgressState } from '../types';

interface ProgressTimelineProps {
  progress: ProgressState;
  className?: string;
}

export const ProgressTimeline: React.FC<ProgressTimelineProps> = ({ progress, className = '' }) => {
  const recentStats = progress.dailyStats.slice(-7).reverse(); // Last 7 days
  const totalSteps = progress.totalStepsCompleted;

  const getStreakColor = (streak: number) => {
    if (streak >= 7) return '#22c55e'; // Green
    if (streak >= 3) return '#3b82f6'; // Blue
    return '#f59e0b'; // Orange
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const getProgressEmoji = (steps: number) => {
    if (steps >= 5) return '🚀';
    if (steps >= 3) return '✅';
    if (steps >= 1) return '💪';
    return '💤';
  };

  return (
    <div className={`progress-timeline ${className}`}>
      <h3>Progress Journey</h3>

      <div className="timeline-stats">
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <div className="stat-label">Current Streak</div>
            <div className="stat-value" style={{ color: getStreakColor(progress.currentStreak) }}>
              {progress.currentStreak} days
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <div className="stat-label">Best Streak</div>
            <div className="stat-value">{progress.longestStreak} days</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔢</div>
          <div className="stat-content">
            <div className="stat-label">Total Steps</div>
            <div className="stat-value">{totalSteps}</div>
          </div>
        </div>
      </div>

      <div className="timeline-chart">
        <h4>Recent Activity</h4>
        <div className="activity-grid">
          {recentStats.map((day) => (
            <div key={day.date} className="activity-day">
              <div className="day-label">{formatDate(day.date)}</div>
              <div className="day-progress">
                {getProgressEmoji(day.stepsCompleted)}
                <div className="day-steps">{day.stepsCompleted}</div>
                <div className="progress-bar" style={{
                  height: `${Math.min((day.stepsCompleted / 5) * 100, 100)}%`,
                  backgroundColor: day.stepsCompleted > 0 ? '#3b82f6' : '#e5e7eb'
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="timeline-insights">
        <h4>What You've Accomplished</h4>
        <div className="insights-content">
          {totalSteps === 0 && (
            <p className="insight-item">You haven't started yet - every expert was once a beginner! 🌱</p>
          )}
          {totalSteps >= 1 && totalSteps < 5 && (
            <p className="insight-item">You've taken your first steps - that's courage! 🎯</p>
          )}
          {totalSteps >= 5 && totalSteps < 10 && (
            <p className="insight-item">You're building momentum - keep going! 🚀</p>
          )}
          {totalSteps >= 10 && progress.currentStreak >= 3 && (
            <p className="insight-item">You're in a groove - consistency is your superpower! ⭐</p>
          )}
          {progress.achievements.length > 0 && (
            <p className="insight-item">You've earned {progress.achievements.length} achievement{progress.achievements.length > 1 ? 's' : ''} - celebrate your wins! 🎉</p>
          )}
        </div>
      </div>

      <style>{`
        .progress-timeline {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .progress-timeline h3 {
          margin: 0 0 2rem 0;
          color: #1f2937;
          font-size: 1.25rem;
        }

        .timeline-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: transform 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .stat-icon {
          font-size: 2rem;
          opacity: 0.8;
        }

        .stat-content {
          flex: 1;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.25rem;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 800;
          color: #1f2937;
        }

        .timeline-chart {
          margin-bottom: 2rem;
        }

        .timeline-chart h4 {
          margin: 0 0 1rem 0;
          color: #374151;
          font-size: 1rem;
        }

        .activity-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.5rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 8px;
        }

        .activity-day {
          text-align: center;
          padding: 0.5rem;
        }

        .day-label {
          font-size: 0.75rem;
          color: #6b7280;
          margin-bottom: 0.5rem;
        }

        .day-progress {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }

        .day-steps {
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
        }

        .progress-bar {
          width: 20px;
          background: #e5e7eb;
          border-radius: 4px;
          margin-top: auto;
          transition: height 0.3s ease, background-color 0.3s ease;
        }

        .timeline-insights {
          background: #f1f5f9;
          border-radius: 12px;
          padding: 1.5rem;
        }

        .timeline-insights h4 {
          margin: 0 0 1rem 0;
          color: #1f2937;
          font-size: 1rem;
        }

        .insights-content {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .insight-item {
          margin: 0;
          color: #334155;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .timeline-stats {
            grid-template-columns: 1fr;
          }

          .activity-grid {
            grid-template-columns: repeat(7, 1fr);
            gap: 0.25rem;
          }

          .activity-day {
            padding: 0.25rem;
          }

          .progress-bar {
            width: 15px;
          }
        }
      `}</style>
    </div>
  );
};