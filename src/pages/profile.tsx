import { useEffect, useState } from 'react';
import { useAppState } from '@/hooks/useAppState';

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/user/profile');
        if (!res.ok) {
          throw new Error('Unauthorized');
        }
        const data = await res.json();
        setUserProfile(data);
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="profile-container">
      <h1 className="text-2xl font-bold">Your Profile</h1>
      <div className="profile-info">
        <p><strong>Name:</strong> {userProfile?.name || '-'}</p>
        <p><strong>Email:</strong> {userProfile?.email || '-'}</p>
        <p><strong>Timezone:</strong> {userProfile?.timezone || '-'}</p>
        <p><strong>Preferences:</strong></p>
        <ul>
          {Object.entries(userProfile?.preferences || {}).map(
            ([key, value]) => <li key={`${key}-${value}`}>{`{key}: ${value}`}</li>
          )}
        </ul>
      </div>
    </div>
  );
}