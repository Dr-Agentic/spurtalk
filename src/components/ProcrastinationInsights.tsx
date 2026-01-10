import React from 'react';
import { useAppState } from '../hooks/useAppState';
import { ProcrastinationPattern } from '../types';

interface ProcrastinationInsightsProps {
  className?: string;
}

export const ProcrastinationInsights: React.FC<ProcrastinationInsightsProps> = ({ className = '' }) => {
  const { generateInsights } = useAppState();

  // Generate insights from current data
  const insights: any[] = generateInsights();
  const actionablePatterns = insights
    .flatMap((insight: any) => insight.patterns as any[])
    .filter((pattern: any) => pattern.isActionable);

  const handleActionSuggestion = (suggestion: string) => {
    // For now, just log the action. In a real app, this might:
    // - Create a new task based on the suggestion
    // - Set a reminder
    // - Update the user's preferences
    console.log('User wants to act on suggestion:', suggestion);
  };

  const getPatternEmoji = (patternType: string): string => {
    switch (patternType) {
      case 'time_of_day': return '⏰';
      case 'task_type': return '📋';
      case 'mood_based': return '💭';
      case 'deadline_procrastination': return '⚡';
      default: return '🔍';
    }
  };

  return (
    <div className={`procrastination-insights ${className}`}>
      <div className="insights-header">
        <h3>🧠 Procrastination Insights</h3>
        <p className="insights-subtitle">
          Understanding your patterns helps you work with them, not against them
        </p>
      </div>

      <div className="insights-content">
        {insights.length === 0 ? (
          <div className="no-insights">
            <div className="insight-card">
              <div className="insight-icon">📊</div>
              <h4>Start Tracking Your Patterns</h4>
              <p>
                As you use SpurTalk, we'll learn about your procrastination patterns
                and provide personalized insights to help you work with your natural tendencies.
              </p>
              <div className="insight-actions">
                <button
                  className="btn-secondary"
                  onClick={() => {
                    // In a real app, this might open a tutorial or guide
                    alert('Start by creating and tracking your first few tasks!');
                  }}
                >
                  How This Works
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Weekly Report */}
            {insights.filter(i => i.isWeeklyReport).map(insight => (
              <div key={insight.id} className="insight-card weekly-report">
                <div className="insight-header">
                  <h4>{insight.title}</h4>
                  <span className="insight-date">
                    {insight.createdAt.toLocaleDateString()}
                  </span>
                </div>

                <div className="insight-description">
                  {insight.description}
                </div>

                <div className="pattern-list">
                  {insight.patterns.map((pattern: any) => (
                    <div key={pattern.id} className="pattern-item">
                      <div className="pattern-header">
                        <span className="pattern-emoji">{getPatternEmoji(pattern.patternType)}</span>
                        <span className="pattern-title">{pattern.description}</span>
                      </div>
                      <div className="pattern-details">
                        <span className="pattern-frequency">
                          Observed {pattern.frequency} times
                        </span>
                        {pattern.lastObserved && (
                          <span className="pattern-date">
                            Last seen: {pattern.lastObserved.toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      {pattern.suggestions.length > 0 && (
                        <div className="pattern-suggestions">
                          <h5>Suggestions:</h5>
                          <ul>
                            {pattern.suggestions.map((suggestion: any, index: any) => (
                              <li key={index}>
                                <button
                                  className="suggestion-btn"
                                  onClick={() => handleActionSuggestion(suggestion as string)}
                                >
                                  {suggestion as string}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {insight.actionableSuggestions.length > 0 && (
                  <div className="insight-suggestions">
                    <h5>This Week's Focus:</h5>
                    <ul>
                      {insight.actionableSuggestions.map((suggestion: any, index: any) => (
                        <li key={index}>
                          <button
                            className="suggestion-btn"
                            onClick={() => handleActionSuggestion(suggestion as string)}
                          >
                            {suggestion as string}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}

            {/* Actionable Patterns */}
            {actionablePatterns.length > 0 && (
              <div className="patterns-section">
                <h4>Your Actionable Patterns</h4>
                <div className="pattern-grid">
                  {actionablePatterns.map(pattern => (
                    <div key={pattern.id} className="pattern-card">
                      <div className="pattern-icon">{getPatternEmoji(pattern.patternType)}</div>
                      <div className="pattern-info">
                        <h5>{pattern.description}</h5>
                        <p className="pattern-frequency">
                          Pattern strength: {Math.min(100, pattern.frequency * 10)}%
                        </p>
                        {pattern.suggestions.length > 0 && (
                          <div className="quick-suggestions">
                            <h6>Quick Wins:</h6>
                            <ul>
                              {pattern.suggestions.slice(0, 2).map((suggestion: any, index: any) => (
                                <li key={index}>
                                  <button
                                    className="quick-suggestion-btn"
                                    onClick={() => handleActionSuggestion(suggestion as string)}
                                  >
                                    {suggestion as string}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Personalized Tips */}
            {insights.length > 0 && (
              <div className="personalized-tips">
                <h4>💡 Personalized Tips</h4>
                <div className="tip-grid">
                  {generatePersonalizedTips(actionablePatterns).map((tip, index) => (
                    <div key={index} className="tip-card">
                      <div className="tip-icon">{tip.icon}</div>
                      <div className="tip-content">
                        <h5>{tip.title}</h5>
                        <p>{tip.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        .procrastination-insights {
          max-width: 800px;
          margin: 0 auto;
          padding: 1rem;
        }

        .insights-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .insights-header h3 {
          margin: 0 0 0.5rem 0;
          color: #2563eb;
          font-size: 1.5rem;
        }

        .insights-subtitle {
          color: #64748b;
          font-size: 0.9rem;
          margin: 0;
        }

        .insights-content {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .no-insights {
          text-align: center;
        }

        .insight-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          border: 1px solid #e2e8f0;
        }

        .weekly-report {
          border-left: 4px solid #22c55e;
        }

        .insight-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .insight-header h4 {
          margin: 0;
          color: #1e293b;
        }

        .insight-date {
          font-size: 0.8rem;
          color: #64748b;
          background: #f1f5f9;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
        }

        .insight-description {
          color: #334155;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .pattern-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .pattern-item {
          background: #f8fafc;
          padding: 1rem;
          border-radius: 8px;
          border-left: 3px solid #3b82f6;
        }

        .pattern-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .pattern-emoji {
          font-size: 1.2rem;
        }

        .pattern-title {
          font-weight: 600;
          color: #1e293b;
        }

        .pattern-details {
          display: flex;
          gap: 1rem;
          font-size: 0.85rem;
          color: #64748b;
          margin-bottom: 1rem;
        }

        .pattern-suggestions h5,
        .insight-suggestions h5,
        .quick-suggestions h6 {
          margin: 0 0 0.5rem 0;
          color: #374151;
          font-size: 0.9rem;
        }

        .pattern-suggestions ul,
        .insight-suggestions ul,
        .quick-suggestions ul {
          margin: 0;
          padding-left: 1.2rem;
        }

        .suggestion-btn,
        .quick-suggestion-btn {
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          color: #3b82f6;
          font-size: 0.9rem;
          padding: 0.25rem 0;
          transition: color 0.2s;
          display: block;
          width: 100%;
          text-align: left;
        }

        .suggestion-btn:hover,
        .quick-suggestion-btn:hover {
          color: #2563eb;
          text-decoration: underline;
        }

        .patterns-section h4,
        .personalized-tips h4 {
          margin: 0 0 1rem 0;
          color: #374151;
        }

        .pattern-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }

        .pattern-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: white;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .pattern-icon {
          font-size: 1.5rem;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f1f5f9;
          border-radius: 50%;
        }

        .pattern-info h5 {
          margin: 0 0 0.25rem 0;
          font-size: 0.9rem;
          color: #1e293b;
        }

        .pattern-frequency {
          font-size: 0.8rem;
          color: #64748b;
          margin-bottom: 0.5rem;
        }

        .quick-suggestions ul {
          margin: 0;
          padding-left: 1.2rem;
        }

        .tip-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .tip-card {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 8px;
          border-left: 3px solid #22c55e;
        }

        .tip-icon {
          font-size: 1.2rem;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #dcfce7;
          border-radius: 50%;
          color: #166534;
        }

        .tip-content h5 {
          margin: 0 0 0.25rem 0;
          font-size: 0.9rem;
          color: #1e293b;
        }

        .tip-content p {
          margin: 0;
          font-size: 0.85rem;
          color: #64748b;
          line-height: 1.4;
        }

        .btn-secondary {
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          color: #334155;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s;
        }

        .btn-secondary:hover {
          background: #e2e8f0;
          border-color: #94a3b8;
        }

        @media (max-width: 768px) {
          .insight-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .pattern-grid,
          .tip-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

// Helper function to generate personalized tips based on patterns
function generatePersonalizedTips(patterns: ProcrastinationPattern[]): Array<{ icon: string; title: string; description: string }> {
  const tips: Array<{ icon: string; title: string; description: string }> = [];

  const timePatterns = patterns.filter(p => p.patternType === 'time_of_day');
  const taskPatterns = patterns.filter(p => p.patternType === 'task_type');
  const emotionPatterns = patterns.filter(p => p.patternType === 'mood_based');
  const deadlinePatterns = patterns.filter(p => p.patternType === 'deadline_procrastination');

  if (timePatterns.length > 0) {
    tips.push({
      icon: '⏰',
      title: 'Optimize Your Schedule',
      description: 'Schedule your most important tasks during your natural energy peaks.'
    });
  }

  if (taskPatterns.length > 0) {
    tips.push({
      icon: '🎯',
      title: 'Use the 2-Minute Rule',
      description: 'Start with just 2 minutes on tasks you typically avoid. You\'ll often find momentum.'
    });
  }

  if (emotionPatterns.length > 0) {
    tips.push({
      icon: '💖',
      title: 'Practice Self-Compassion',
      description: 'Notice emotions without judgment. They\'re data, not directives.'
    });
  }

  if (deadlinePatterns.length > 0) {
    tips.push({
      icon: '⚡',
      title: 'Create Artificial Deadlines',
      description: 'Set earlier deadlines for yourself or share commitments with accountability partners.'
    });
  }

  // Default tips if no specific patterns
  if (tips.length === 0) {
    tips.push(
      {
        icon: '🧠',
        title: 'Track Your Patterns',
        description: 'The more you use SpurTalk, the better insights we can provide.'
      },
      {
        icon: '💪',
        title: 'Progress Over Perfection',
        description: 'Every small step forward is a victory. Celebrate your momentum!'
      }
    );
  }

  return tips.slice(0, 3); // Limit to 3 tips
}