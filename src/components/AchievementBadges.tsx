import React from 'react';
import { Achievement } from '../types';

interface AchievementBadgesProps {
  achievements: Achievement[];
}

export const AchievementBadges: React.FC<AchievementBadgesProps> = ({
  achievements
}) => {
  const unlockedAchievements = achievements.filter(a => a.isUnlocked);

  if (unlockedAchievements.length === 0) {
    return (
      <div className="achievement-container">
        <div className="achievement-prompt">
          <h4>Ready for Your First Badge?</h4>
          <p>Complete 5 micro-steps to unlock your first achievement!</p>
          <div className="progress-hint">
            <span className="progress-dot">•</span>
            <span className="progress-dot">•</span>
            <span className="progress-dot">•</span>
            <span className="progress-dot">•</span>
            <span className="progress-dot">•</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="achievement-container">
      <div className="achievement-header">
        <h4>Your Achievements</h4>
        <p className="achievement-count">You've unlocked {unlockedAchievements.length} badge{unlockedAchievements.length > 1 ? 's' : ''}!</p>
      </div>

      <div className="achievement-grid">
        {unlockedAchievements.map((achievement) => (
          <div key={achievement.id} className="achievement-card">
            <div className="achievement-icon">
              <span className="icon-emoji">{achievement.icon}</span>
            </div>
            <div className="achievement-content">
              <h5 className="achievement-title">{achievement.title}</h5>
              <p className="achievement-desc">{achievement.description}</p>
              <span className="achievement-date">
                Unlocked {formatDate(achievement.unlockedAt)}
              </span>
            </div>
            <div className="achievement-celebration">
              <span className="celebration-text">🎉</span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .achievement-container {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .achievement-prompt {
          text-align: center;
          padding: 2rem;
        }

        .achievement-prompt h4 {
          margin: 0 0 0.5rem 0;
          font-size: 1.25rem;
          color: #374151;
        }

        .achievement-prompt p {
          margin: 0 0 1rem 0;
          color: #6b7280;
          font-size: 1rem;
        }

        .progress-hint {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
        }

        .progress-dot {
          font-size: 1.5rem;
          opacity: 0.3;
          animation: bounce 1s infinite;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }

        .achievement-header {
          margin-bottom: 1.5rem;
        }

        .achievement-header h4 {
          margin: 0 0 0.25rem 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: #1f2937;
        }

        .achievement-count {
          margin: 0;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .achievement-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1rem;
        }

        .achievement-card {
          display: flex;
          align-items: center;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1rem;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .achievement-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .achievement-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #3b82f6, #22c55e);
          opacity: 0.8;
        }

        .achievement-icon {
          margin-right: 1rem;
          background: white;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          border: 2px solid #e5e7eb;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }

        .icon-emoji {
          font-size: 2rem;
          line-height: 1;
        }

        .achievement-content {
          flex: 1;
          min-width: 0;
        }

        .achievement-title {
          margin: 0 0 0.25rem 0;
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
        }

        .achievement-desc {
          margin: 0 0 0.5rem 0;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .achievement-date {
          font-size: 0.75rem;
          color: #9ca3af;
          font-weight: 500;
        }

        .achievement-celebration {
          margin-left: 1rem;
          font-size: 1.5rem;
          opacity: 0.8;
          animation: spin 2s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

function formatDate(date: Date): string {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString();
}