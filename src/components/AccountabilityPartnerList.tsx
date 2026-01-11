import React, { useState } from 'react';
import { AccountabilityPartner } from '../types';
import { useAppState } from '../hooks/useAppState';

interface AccountabilityPartnerListProps {
  onPartnerSelect?: (partner: AccountabilityPartner) => void;
}

export const AccountabilityPartnerList: React.FC<AccountabilityPartnerListProps & { className?: string }> = ({
  onPartnerSelect,
  className
}) => {
  const { state, addAccountabilityPartner, removeAccountabilityPartner } = useAppState();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPartnerName, setNewPartnerName] = useState('');
  const [newPartnerRelationship, setNewPartnerRelationship] = useState<'friend' | 'colleague' | 'mentor' | 'family' | 'other'>('friend');
  const [newPartnerEmail, setNewPartnerEmail] = useState('');

  const handleAddPartner = () => {
    if (newPartnerName.trim()) {
      addAccountabilityPartner(
        newPartnerName.trim(),
        newPartnerRelationship,
        newPartnerEmail.trim() || undefined
      );
      setNewPartnerName('');
      setNewPartnerEmail('');
      setShowAddForm(false);
    }
  };

  const handleSelectPartner = (partner: AccountabilityPartner) => {
    if (onPartnerSelect) {
      onPartnerSelect(partner);
    }
  };

  return (
    <div className={`accountability-partner-list ${className || ''}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Accountability Partners</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          {showAddForm ? 'Cancel' : 'Add Partner'}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-gray-50 p-4 rounded mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={newPartnerName}
                onChange={(e) => setNewPartnerName(e.target.value)}
                placeholder="Enter partner's name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Relationship
              </label>
              <select
                value={newPartnerRelationship}
                onChange={(e) => setNewPartnerRelationship(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="friend">Friend</option>
                <option value="colleague">Colleague</option>
                <option value="mentor">Mentor</option>
                <option value="family">Family</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email (optional)
              </label>
              <input
                type="email"
                value={newPartnerEmail}
                onChange={(e) => setNewPartnerEmail(e.target.value)}
                placeholder="partner@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleAddPartner}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Add Partner
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {state.accountabilityPartners.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No accountability partners yet. Add one to get started!
          </div>
        ) : (
          state.accountabilityPartners.map((partner) => (
            <div
              key={partner.id}
              className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex-1">
                <div className="font-medium">{partner.name}</div>
                <div className="text-sm text-gray-600 capitalize">{partner.relationship}</div>
                {partner.email && (
                  <div className="text-sm text-gray-500">{partner.email}</div>
                )}
                <div className="text-xs text-gray-400 mt-1">
                  {partner.isActive ? 'Active' : 'Inactive'}
                  {partner.lastContact && (
                    <span className="ml-2">
                      Last contact: {partner.lastContact.toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {onPartnerSelect && (
                  <button
                    onClick={() => handleSelectPartner(partner)}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                  >
                    Share Task
                  </button>
                )}
                <button
                  onClick={() => removeAccountabilityPartner(partner.id)}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};