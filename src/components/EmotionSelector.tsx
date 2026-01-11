import React, { useState } from 'react';
import { useAppState } from '../hooks/useAppState';

interface EmotionSelectorProps {
  className?: string;
}

export const EmotionSelector: React.FC<EmotionSelectorProps> = ({ className = '' }) => {
  const { setCurrentEmotion, getCurrentEmotion } = useAppState();
  const [showSelector, setShowSelector] = useState(false);

  const currentEmotion = getCurrentEmotion();

  const emotions = [
    { key: 'energized', label: 'Energized', emoji: '⚡', intensity: 8 },
    { key: 'motivated', label: 'Motivated', emoji: '🚀', intensity: 7 },
    { key: 'focused', label: 'Focused', emoji: '🎯', intensity: 6 },
    { key: 'creative', label: 'Creative', emoji: '🎨', intensity: 7 },
    { key: 'anxious', label: 'Anxious', emoji: '😟', intensity: 5 },
    { key: 'overwhelmed', label: 'Overwhelmed', emoji: '😵', intensity: 4 },
    { key: 'tired', label: 'Tired', emoji: '😴', intensity: 3 },
    { key: 'brain-dead', label: 'Brain Dead', emoji: '🧟', intensity: 1 }
  ];

  const handleEmotionSelect = (emotion: string, intensity: number) => {
    setCurrentEmotion(emotion as any, intensity);
    setShowSelector(false);
  };

  const getEmotionDisplay = () => {
    if (!currentEmotion) return null;

    const emotionInfo = emotions.find(e => e.key === currentEmotion.emotion);
    return {
      ...emotionInfo,
      intensity: currentEmotion.intensity
    };
  };

  const display = getEmotionDisplay();

  return (
    <div className={`emotion-selector ${className}`}>
      <div className="emotion-header">
        <h4>How are you feeling right now?</h4>
        <p className="emotion-subtitle">
          {display
            ? `Current: ${display.label} ${display.emoji}`
            : "Set your emotion to get personalized task suggestions"}
        </p>
      </div>

      {display && (
        <div className="current-emotion-display">
          <div className="emotion-badge">
            <span className="emotion-emoji">{display.emoji}</span>
            <span className="emotion-label">{display.label}</span>
            <span className="intensity-bar">
              <div
                className="intensity-fill"
                style={{ width: `${(display.intensity / 10) * 100}%` }}
              />
            </span>
            <span className="intensity-value">{display.intensity}/10</span>
          </div>
          <button
            className="change-emotion-btn"
            onClick={() => setShowSelector(true)}
          >
            Change
          </button>
        </div>
      )}

      {!display && (
        <button
          className="set-emotion-btn"
          onClick={() => setShowSelector(true)}
        >
          Set Your Emotion
        </button>
      )}

      {showSelector && (
        <div className="emotion-selector-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h5>Select Your Current State</h5>
              <button
                className="close-btn"
                onClick={() => setShowSelector(false)}
              >
                ✕
              </button>
            </div>
            <div className="emotion-grid">
              {emotions.map((emotion) => (
                <button
                  key={emotion.key}
                  className="emotion-option"
                  onClick={() => handleEmotionSelect(emotion.key, emotion.intensity)}
                  title={`${emotion.label} - ${emotion.intensity}/10`}
                >
                  <span className="emotion-emoji-large">{emotion.emoji}</span>
                  <span className="emotion-label">{emotion.label}</span>
                  <span className="emotion-intensity">{emotion.intensity}/10</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>
        {`
        .emotion-selector {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          border: 1px solid #e2e8f0;
        }

        .emotion-header h4 {
          margin: 0 0 0.5rem 0;
          font-size: 1rem;
          color: #1e293b;
        }

        .emotion-subtitle {
          margin: 0;
          color: #64748b;
          font-size: 0.9rem;
        }

        .current-emotion-display {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-top: 1rem;
        }

        .emotion-badge {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: #f8fafc;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
        }

        .emotion-emoji {
          font-size: 1.2rem;
        }

        .emotion-emoji-large {
          font-size: 1.5rem;
          display: block;
          margin-bottom: 0.25rem;
        }

        .emotion-label {
          font-weight: 600;
          color: #1e293b;
        }

        .intensity-bar {
          width: 60px;
          height: 4px;
          background: #e2e8f0;
          border-radius: 2px;
          overflow: hidden;
        }

        .intensity-fill {
          height: 100%;
          background: #3b82f6;
          transition: width 0.3s ease;
        }

        .intensity-value {
          font-size: 0.8rem;
          color: #64748b;
          font-weight: 600;
        }

        .set-emotion-btn, .change-emotion-btn {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .set-emotion-btn:hover, .change-emotion-btn:hover {
          background: #2563eb;
        }

        .emotion-selector-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          max-width: 600px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .modal-header h5 {
          margin: 0;
          color: #1e293b;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #64748b;
        }

        .emotion-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 1rem;
        }

        .emotion-option {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
        }

        .emotion-option:hover {
          background: #eff6ff;
          border-color: #3b82f6;
          transform: translateY(-2px);
        }

        .emotion-option:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }

        .emotion-label {
          display: block;
          font-weight: 600;
          margin-top: 0.5rem;
          color: #1e293b;
        }

        .emotion-intensity {
          display: block;
          font-size: 0.8rem;
          color: #64748b;
          margin-top: 0.25rem;
        }
        `}
      </style>
    </div>
  );
};