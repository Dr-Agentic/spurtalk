import React, { useState } from 'react';
import { Task } from '../types';
import { useAppState } from '../hooks/useAppState';

interface TaskSharingProps {
  task: Task;
  onShareComplete?: (success: boolean) => void;
}

export const TaskSharing: React.FC<TaskSharingProps> = ({
  task,
  onShareComplete
}) => {
  const {
    state,
    shareTaskWithPartner,
    sendEncouragement,
    getSharedTasks,
    getPartnerTasks,
    acceptTaskSharing,
    declineTaskSharing,
    getUnreadEncouragementMessages,
    markEncouragementRead
  } = useAppState();

  const [selectedPartnerId, setSelectedPartnerId] = useState<string>('');
  const [customMessage, setCustomMessage] = useState('');
  const [showShareForm, setShowShareForm] = useState(false);
  const [showEncouragementForm, setShowEncouragementForm] = useState(false);
  const [encouragementMessage, setEncouragementMessage] = useState('');

  const handleShareTask = () => {
    if (selectedPartnerId) {
      const success = shareTaskWithPartner(
        task.id,
        selectedPartnerId,
        customMessage.trim() || undefined
      );

      if (success) {
        setSelectedPartnerId('');
        setCustomMessage('');
        setShowShareForm(false);
        if (onShareComplete) onShareComplete(true);
      }
    }
  };

  const handleSendEncouragement = () => {
    const partnerId = selectedPartnerId || state.accountabilityPartners[0]?.id;
    if (partnerId && encouragementMessage.trim()) {
      sendEncouragement(partnerId, task.id, encouragementMessage.trim());
      setEncouragementMessage('');
      setShowEncouragementForm(false);
    }
  };

  const sharedTasks = getSharedTasks(task.id);
  const partnerTasks = getPartnerTasks(task.id);
  const unreadMessages = getUnreadEncouragementMessages(task.id);

  return (
    <div className="task-sharing space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Share Task</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setShowShareForm(!showShareForm)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Share Task
          </button>
          {state.accountabilityPartners.length > 0 && (
            <button
              onClick={() => setShowEncouragementForm(!showEncouragementForm)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Send Encouragement
            </button>
          )}
        </div>
      </div>

      {/* Share Task Form */}
      {showShareForm && (
        <div className="bg-gray-50 p-4 rounded">
          <h4 className="font-medium mb-2">Share "{task.title}" with partner</h4>
          <div className="space-y-3">
            <select
              value={selectedPartnerId}
              onChange={(e) => setSelectedPartnerId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a partner</option>
              {state.accountabilityPartners.map((partner) => (
                <option key={partner.id} value={partner.id}>
                  {partner.name} ({partner.relationship})
                </option>
              ))}
            </select>

            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Add a custom message (optional)"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex gap-2">
              <button
                onClick={handleShareTask}
                disabled={!selectedPartnerId}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Share Task
              </button>
              <button
                onClick={() => setShowShareForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Encouragement Form */}
      {showEncouragementForm && (
        <div className="bg-gray-50 p-4 rounded">
          <h4 className="font-medium mb-2">Send encouragement for "{task.title}"</h4>
          <div className="space-y-3">
            <textarea
              value={encouragementMessage}
              onChange={(e) => setEncouragementMessage(e.target.value)}
              placeholder="Write an encouraging message..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex gap-2">
              <button
                onClick={handleSendEncouragement}
                disabled={!encouragementMessage.trim()}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Encouragement
              </button>
              <button
                onClick={() => setShowEncouragementForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shared With */}
      {partnerTasks.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium mb-2">Shared with:</h4>
          <div className="space-y-2">
            {partnerTasks.map(({ sharing, ...partner }) => (
              <div key={sharing.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div>
                  <div className="font-medium">{partner.name}</div>
                  <div className="text-sm text-gray-600 capitalize">{partner.relationship}</div>
                  <div className="text-xs text-gray-500">
                    Shared: {sharing.sharedAt.toLocaleDateString()}
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Status: <span className={`px-2 py-1 rounded ${
                    sharing.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    sharing.status === 'declined' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {sharing.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notifications */}
      {unreadMessages.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium mb-2">Encouragement Messages</h4>
          <div className="space-y-2">
            {unreadMessages.map((message) => (
              <div key={message.id} className="p-3 bg-blue-50 border border-blue-200 rounded">
                <div className="font-medium text-blue-900">
                  {state.accountabilityPartners.find(p => p.id === message.fromPartnerId)?.name}
                </div>
                <div className="text-sm text-blue-800 mt-1">{message.message}</div>
                <div className="text-xs text-blue-600 mt-1">
                  {message.sentAt.toLocaleString()}
                </div>
                <button
                  onClick={() => markEncouragementRead(message.id)}
                  className="mt-2 text-xs text-blue-700 hover:text-blue-900"
                >
                  Mark as read
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Partner Actions */}
      {sharedTasks.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium mb-2">Tasks shared with you</h4>
          <div className="space-y-2">
            {sharedTasks.map(({ sharing, ...task }) => (
              <div key={sharing.id} className="p-3 border border-gray-200 rounded">
                <div className="font-medium">{task.title}</div>
                <div className="text-sm text-gray-600 mt-1">{task.description}</div>
                <div className="flex gap-2 mt-2">
                  {sharing.status === 'pending' && (
                    <>
                      <button
                        onClick={() => acceptTaskSharing(sharing.id)}
                        className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => declineTaskSharing(sharing.id)}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                      >
                        Decline
                      </button>
                    </>
                  )}
                  {sharing.status === 'accepted' && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded">
                      Accepted
                    </span>
                  )}
                  {sharing.status === 'declined' && (
                    <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded">
                      Declined
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};