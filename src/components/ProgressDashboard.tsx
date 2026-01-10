import React from 'react';
import { ProgressState } from '../types';
import { ProgressBar } from './ProgressBar';
import { AchievementBadges } from './AchievementBadges';

interface ProgressDashboardProps {
  progress: ProgressState;
  className?: string;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  progress,
  className = ''
}) => {
  return (
    <div className={`progress-dashboard ${className}`}>
      <ProgressBar progress={progress} />

      <AchievementBadges achievements={progress.achievements} />

      <style>{`
        .progress-dashboard {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          max-width: 800px;
          margin: 0 auto;
        }

        @media (min-width: 768px) {
          grid-template-columns: 2fr 1fr;
        }
      `}</style>
    </div>
  );
};