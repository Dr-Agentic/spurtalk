import React from 'react';
import { useAppState } from '../hooks/useAppState';
import { getRandomQuote } from '../utils/perfectionismUtils';

interface AntiPerfectionismModeProps {
  className?: string;
}

export const AntiPerfectionismMode: React.FC<AntiPerfectionismModeProps> = ({ className = '' }) => {
  const { state, togglePerfectionismMode } = useAppState();
  const [currentQuote, setCurrentQuote] = React.useState(getRandomQuote());

  React.useEffect(() => {
    // Change quote every 30 seconds when in perfectionism mode
    if (state.isPerfectionismMode) {
      const interval = setInterval(() => {
        setCurrentQuote(getRandomQuote());
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [state.isPerfectionismMode]);

  const getModeLabel = () => {
    if (state.isPerfectionismMode) {
      return "Anti-Perfectionism Mode: ON";
    }
    return "Anti-Perfectionism Mode: OFF";
  };

  const getModeDescription = () => {
    if (state.isPerfectionismMode) {
      return "Focus on progress, not perfection. Good enough is good enough!";
    }
    return "Toggle on to reduce perfectionism and focus on action.";
  };

  const getModeColor = () => {
    if (state.isPerfectionismMode) {
      return {
        bg: '#fef3c7',
        text: '#92400e',
        border: '#f59e0b'
      };
    }
    return {
      bg: '#f3f4f6',
      text: '#374151',
      border: '#d1d5db'
    };
  };

  const colors = getModeColor();

  return (
    <div className={`anti-perfectionism-mode ${className}`} style={{ borderColor: colors.border }}>
      <div className="mode-header">
        <div className="mode-toggle">
          <button
            className="toggle-switch"
            onClick={togglePerfectionismMode}
            aria-pressed={state.isPerfectionismMode}
            aria-label="Toggle Anti-Perfectionism Mode"
          >
            <span className="toggle-track">
              <span className="toggle-thumb" style={{
                transform: state.isPerfectionismMode ? 'translateX(22px)' : 'translateX(2px)',
                backgroundColor: state.isPerfectionismMode ? '#f59e0b' : '#9ca3af'
              }} />
            </span>
          </button>
          <div className="mode-info">
            <h3 style={{ color: colors.text }}>{getModeLabel()}</h3>
            <p style={{ color: colors.text }}>{getModeDescription()}</p>
          </div>
        </div>

        {state.isPerfectionismMode && (
          <button
            className="get-quote-btn"
            onClick={() => setCurrentQuote(getRandomQuote())}
            style={{ backgroundColor: colors.bg, color: colors.text }}
          >
            🎲 New Mantra
          </button>
        )}
      </div>

      {state.isPerfectionismMode && (
        <div className="motivational-quote">
          <div className="quote-content">
            <blockquote>
              "{currentQuote.text}"
            </blockquote>
            {currentQuote.author && (
              <cite>— {currentQuote.author}</cite>
            )}
          </div>
          <div className="quote-category">
            <span className="category-badge">
              {formatCategory(currentQuote.category)}
            </span>
          </div>
        </div>
      )}

      <style>{`
        .anti-perfectionism-mode {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 2px solid;
          transition: all 0.3s ease;
        }

        .mode-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .mode-toggle {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .toggle-switch {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          width: 50px;
          height: 30px;
          position: relative;
        }

        .toggle-track {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #e5e7eb;
          border-radius: 999px;
          display: flex;
          align-items: center;
          padding: 2px;
          transition: background-color 0.2s;
        }

        .toggle-thumb {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .toggle-switch:hover .toggle-track {
          background: #d1d5db;
        }

        .mode-info h3 {
          margin: 0 0 0.25rem 0;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .mode-info p {
          margin: 0;
          font-size: 0.875rem;
          opacity: 0.8;
        }

        .get-quote-btn {
          padding: 0.5rem 1rem;
          border-radius: 8px;
          border: 2px solid;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
          font-size: 0.875rem;
        }

        .get-quote-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .motivational-quote {
          background: #fffbeb;
          border: 1px solid #f59e0b;
          border-radius: 12px;
          padding: 1.5rem;
          margin-top: 1rem;
          border-left: 4px solid #f59e0b;
        }

        .quote-content {
          text-align: center;
        }

        .quote-content blockquote {
          margin: 0 0 0.5rem 0;
          font-size: 1.1rem;
          font-style: italic;
          color: #92400e;
          line-height: 1.5;
        }

        .quote-content cite {
          font-style: normal;
          font-size: 0.875rem;
          color: #d97706;
          font-weight: 600;
        }

        .quote-category {
          display: flex;
          justify-content: center;
          margin-top: 1rem;
        }

        .category-badge {
          background: #fde68a;
          color: #92400e;
          padding: 0.25rem 0.75rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        @media (max-width: 768px) {
          .mode-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .get-quote-btn {
            align-self: flex-end;
          }
        }
      `}</style>
    </div>
  );
};

function formatCategory(category: string): string {
  return category
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}