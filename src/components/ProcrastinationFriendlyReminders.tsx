import React, { useState, useEffect } from 'react';
import { useAppState } from '../hooks/useAppState';
import { soundEffects } from '../utils/soundEffects';

interface ProcrastinationFriendlyRemindersProps {
  className?: string;
}

export const ProcrastinationFriendlyReminders: React.FC<ProcrastinationFriendlyRemindersProps> = ({
  className = ''
}) => {
  const {
    state,
    snoozeReminder,
    completeReminder,
    getActiveReminders,
    getSuggestedReasons,
    getCompletionMessage
  } = useAppState();

  const [showSettings, setShowSettings] = useState(false);
  const [customReason, setCustomReason] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');

  const activeReminders = getActiveReminders();
  const suggestedReasons = getSuggestedReasons();

  useEffect(() => {
    // Auto-play celebration sound when showing celebration
    if (showCelebration && state.reminderSettings.celebrationEnabled) {
      soundEffects.playTone(800, 500, 'sine');
      setTimeout(() => {
        setShowCelebration(false);
        setCelebrationMessage('');
      }, 3000);
    }
  }, [showCelebration]);

  const handleSnooze = (reminderId: string, reason?: string) => {
    const reasonToUse = reason || customReason || 'not now';
    const result = snoozeReminder(reminderId, reasonToUse);

    if (result) {
      if (result.isCompleted) {
        // Auto-completed due to max snoozes
        setCelebrationMessage(`Hooray! "${result.title}" is technically done! 🎉`);
        setShowCelebration(true);
      }
    }
  };

  const handleComplete = (reminderId: string) => {
    const result = completeReminder(reminderId);
    if (result) {
      setCelebrationMessage(getCompletionMessage());
      setShowCelebration(true);
    }
  };

  const handleDismiss = (reminderId: string) => {
    // Soft dismiss - mark as snoozed with "later" reason
    handleSnooze(reminderId, 'later');
  };

  const getToneColor = (tone: string): string => {
    switch (tone) {
      case 'encouraging': return '#22c55e'; // Green
      case 'neutral': return '#64748b'; // Gray-blue
      case 'humorous': return '#f59e0b'; // Orange
      default: return '#64748b';
    }
  };

  const getToneEmoji = (tone: string): string => {
    switch (tone) {
      case 'encouraging': return '💖';
      case 'neutral': return '🙂';
      case 'humorous': return '😂';
      default: return '💬';
    }
  };

  if (!state.reminderSettings.enabled || activeReminders.length === 0) {
    return (
      <div className={`reminders-container ${className}`}>
        <div className="reminders-header">
          <h3>Procrastination-Friendly Reminders</h3>
          <div className="reminder-controls">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="settings-toggle"
            >
              ⚙️ Settings
            </button>
          </div>
        </div>

        {showSettings && (
          <ReminderSettingsPanel />
        )}

        <div className="no-reminders">
          <span className="no-reminders-icon">🕊️</span>
          <p>No reminders right now! Your tasks are patiently waiting.</p>
          <p className="subtext">Reminders appear when it's time for a gentle nudge.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`reminders-container ${className}`}>
      <div className="reminders-header">
        <h3>Kind Reminders</h3>
        <div className="reminder-controls">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="settings-toggle"
          >
            ⚙️ Settings
          </button>
        </div>
      </div>

      {showSettings && (
        <ReminderSettingsPanel />
      )}

      <div className="active-reminders">
        {activeReminders.map((reminder) => (
          <div key={reminder.id} className="reminder-card">
            <div className="reminder-header">
              <span className="reminder-tone" style={{ color: getToneColor(reminder.tone) }}>
                {getToneEmoji(reminder.tone)} {reminder.tone.charAt(0).toUpperCase() + reminder.tone.slice(1)}
              </span>
              <span className="reminder-time">
                {reminder.snoozeCount > 0 && `Snoozed ${reminder.snoozeCount} time(s)`}
              </span>
            </div>

            <div className="reminder-title">
              {reminder.title}
            </div>

            <div className="reminder-message">
              {reminder.message}
            </div>

            <div className="reminder-actions">
              <div className="snooze-options">
                <p className="snooze-label">Not ready? That's okay:</p>
                <div className="reason-buttons">
                  {suggestedReasons.map((reason) => (
                    <button
                      key={reason}
                      onClick={() => handleSnooze(reminder.id, reason)}
                      className="snooze-btn"
                    >
                      {reason}
                    </button>
                  ))}
                  <button
                    onClick={() => handleSnooze(reminder.id, 'later')}
                    className="snooze-btn"
                  >
                    In a bit
                  </button>
                </div>

                <div className="custom-reason">
                  <input
                    type="text"
                    placeholder="Or tell me why..."
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    className="reason-input"
                  />
                  <button
                    onClick={() => handleSnooze(reminder.id)}
                    className="snooze-btn custom"
                    disabled={!customReason.trim()}
                  >
                    Snooze with reason
                  </button>
                </div>
              </div>

              <div className="action-buttons">
                <button
                  onClick={() => handleDismiss(reminder.id)}
                  className="dismiss-btn"
                >
                  ✨ Soft dismiss
                </button>
                <button
                  onClick={() => handleComplete(reminder.id)}
                  className="complete-btn"
                >
                  🎯 I'll do it!
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showCelebration && (
        <div className="celebration-modal">
          <div className="celebration-content">
            <span className="celebration-icon">🎉</span>
            <p className="celebration-message">{celebrationMessage}</p>
            <button onClick={() => setShowCelebration(false)} className="celebration-close">
              ✨ Close
            </button>
          </div>
        </div>
      )}

      <style>{`
        .reminders-container {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .reminders-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .reminders-header h3 {
          margin: 0;
          font-size: 1.25rem;
          color: #1f2937;
        }

        .reminder-controls {
          display: flex;
          gap: 0.5rem;
        }

        .settings-toggle {
          background: #f3f4f6;
          border: 1px solid #d1d5db;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.2s;
        }

        .settings-toggle:hover {
          background: #e5e7eb;
          transform: translateY(-1px);
        }

        .no-reminders {
          text-align: center;
          padding: 2rem;
          color: #6b7280;
        }

        .no-reminders-icon {
          font-size: 3rem;
          display: block;
          margin-bottom: 1rem;
        }

        .subtext {
          font-size: 0.875rem;
          color: #9ca3af;
        }

        .active-reminders {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .reminder-card {
          background: #fafafa;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 1.5rem;
          transition: all 0.2s;
        }

        .reminder-card:hover {
          background: #f8fafc;
          border-color: #d1d5db;
        }

        .reminder-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .reminder-tone {
          font-weight: 600;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .reminder-time {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .reminder-title {
          font-weight: 600;
          font-size: 1.1rem;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .reminder-message {
          color: #4b5563;
          line-height: 1.5;
          margin-bottom: 1.5rem;
          font-style: italic;
        }

        .reminder-actions {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1rem;
        }

        .snooze-options {
          background: white;
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .snooze-label {
          margin: 0 0 0.5rem 0;
          font-size: 0.875rem;
          color: #374151;
          font-weight: 500;
        }

        .reason-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .snooze-btn {
          background: #f3f4f6;
          border: 1px solid #d1d5db;
          padding: 0.5rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .snooze-btn:hover {
          background: #e5e7eb;
          transform: translateY(-1px);
        }

        .snooze-btn.custom {
          background: #fef3c7;
          border-color: #f59e0b;
          color: #92400e;
        }

        .custom-reason {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .reason-input {
          flex: 1;
          padding: 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 0.875rem;
        }

        .action-buttons {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .dismiss-btn, .complete-btn {
          padding: 0.75rem 1rem;
          border-radius: 8px;
          border: 1px solid #d1d5db;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
          text-align: left;
        }

        .dismiss-btn {
          background: white;
          color: #6b7280;
        }

        .dismiss-btn:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .complete-btn {
          background: #22c55e;
          border-color: #16a34a;
          color: white;
        }

        .complete-btn:hover {
          background: #16a34a;
          transform: translateY(-1px);
        }

        .celebration-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .celebration-content {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          text-align: center;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          max-width: 400px;
        }

        .celebration-icon {
          font-size: 3rem;
          display: block;
          margin-bottom: 1rem;
        }

        .celebration-message {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 1.5rem;
        }

        .celebration-close {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .celebration-close:hover {
          background: #2563eb;
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .reminder-actions {
            grid-template-columns: 1fr;
          }

          .custom-reason {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  );
};

// Settings panel component
const ReminderSettingsPanel: React.FC = () => {
  const { state, updateReminderSettings } = useAppState();

  const handleToneChange = (tone: 'encouraging' | 'neutral' | 'humorous') => {
    updateReminderSettings({ tone });
  };

  const handleToggle = (setting: keyof Omit<typeof state.reminderSettings, 'tone'>) => {
    updateReminderSettings({ [setting]: !state.reminderSettings[setting] });
  };

  return (
    <div className="reminder-settings">
      <h4>Reminder Settings</h4>

      <div className="setting-group">
        <label>Reminder Tone</label>
        <div className="tone-options">
          <button
            className={`tone-option ${state.reminderSettings.tone === 'encouraging' ? 'active' : ''}`}
            onClick={() => handleToneChange('encouraging')}
          >
            💖 Encouraging
          </button>
          <button
            className={`tone-option ${state.reminderSettings.tone === 'neutral' ? 'active' : ''}`}
            onClick={() => handleToneChange('neutral')}
          >
            🙂 Neutral
          </button>
          <button
            className={`tone-option ${state.reminderSettings.tone === 'humorous' ? 'active' : ''}`}
            onClick={() => handleToneChange('humorous')}
          >
            😂 Humorous
          </button>
        </div>
      </div>

      <div className="setting-group">
        <label className="setting-label">
          <input
            type="checkbox"
            checked={state.reminderSettings.enabled}
            onChange={() => handleToggle('enabled')}
          />
          Enable reminders
        </label>
      </div>

      <div className="setting-group">
        <label className="setting-label">
          <input
            type="checkbox"
            checked={state.reminderSettings.smartTiming}
            onChange={() => handleToggle('smartTiming')}
          />
          Smart timing (learn from your patterns)
        </label>
      </div>

      <div className="setting-group">
        <label className="setting-label">
          <input
            type="checkbox"
            checked={state.reminderSettings.spamProtection}
            onChange={() => handleToggle('spamProtection')}
          />
          Spam protection (limit repeated reminders)
        </label>
      </div>

      <div className="setting-group">
        <label className="setting-label">
          <input
            type="checkbox"
            checked={state.reminderSettings.celebrationEnabled}
            onChange={() => handleToggle('celebrationEnabled')}
          />
          Celebration on completion
        </label>
      </div>

      <div className="setting-info">
        <p>Tips:</p>
        <ul>
          <li>Encouraging tone: Supportive messages that build confidence</li>
          <li>Neutral tone: Matter-of-fact reminders without emotional language</li>
          <li>Humorous tone: Light-hearted messages to reduce pressure</li>
          <li>Smart timing learns when you're most likely to respond</li>
          <li>Spam protection prevents reminder fatigue</li>
        </ul>
      </div>

      <style>{`
        .reminder-settings {
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1rem;
        }

        .reminder-settings h4 {
          margin: 0 0 1rem 0;
          color: #374151;
        }

        .setting-group {
          margin-bottom: 1.5rem;
        }

        .setting-group:last-child {
          margin-bottom: 0;
        }

        .tone-options {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .tone-option {
          padding: 0.5rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tone-option:hover {
          background: #f3f4f6;
          transform: translateY(-1px);
        }

        .tone-option.active {
          background: #e0f2fe;
          border-color: #0ea5e9;
          color: #0c4a6e;
        }

        .setting-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #374151;
          cursor: pointer;
        }

        .setting-label input {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .setting-info {
          background: white;
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          margin-top: 1rem;
        }

        .setting-info p {
          margin: 0 0 0.5rem 0;
          font-weight: 600;
          color: #374151;
        }

        .setting-info ul {
          margin: 0;
          padding-left: 1.5rem;
          color: #6b7280;
        }

        .setting-info li {
          margin-bottom: 0.25rem;
        }
      `}</style>
    </div>
  );
};