'use client';

import { useState, useEffect } from 'react';
import { z } from 'zod';

const profileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(100),
  username: z.string().min(3, 'Username must be at least 3 characters').max(30),
  notificationPreferences: z.object({
    raceCompleted: z.boolean(),
    draftTurn: z.boolean(),
    invitations: z.boolean(),
    teamUpdates: z.boolean(),
    pointsUpdated: z.boolean(),
  }),
  themePreference: z.enum(['light', 'dark', 'system']),
  languagePreference: z.string().max(10),
  timezonePreference: z.string().max(50),
  profileVisibility: z.enum(['public', 'private']),
  showEmailToLeagueMembers: z.boolean(),
});

type Status = 'idle' | 'loading' | 'success' | 'error';

interface UserProfile {
  fullName: string;
  username: string;
  email: string;
  notificationPreferences: {
    raceCompleted: boolean;
    draftTurn: boolean;
    invitations: boolean;
    teamUpdates: boolean;
    pointsUpdated: boolean;
  };
  themePreference: 'light' | 'dark' | 'system';
  languagePreference: string;
  timezonePreference: string;
  profileVisibility: 'public' | 'private';
  showEmailToLeagueMembers: boolean;
}

export function ProfileForm() {
  const [formData, setFormData] = useState<UserProfile>({
    fullName: '',
    username: '',
    email: '',
    notificationPreferences: {
      raceCompleted: true,
      draftTurn: true,
      invitations: true,
      teamUpdates: false,
      pointsUpdated: true,
    },
    themePreference: 'system',
    languagePreference: 'en',
    timezonePreference: 'UTC',
    profileVisibility: 'public',
    showEmailToLeagueMembers: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch('/api/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (response.ok) {
          const data = await response.json();
          setFormData((prev) => ({ ...prev, ...data.user }));
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoadingProfile(false);
      }
    }
    
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith('notification_')) {
      const prefKey = name.replace('notification_', '');
      setFormData((prev) => ({
        ...prev,
        notificationPreferences: {
          ...prev.notificationPreferences,
          [prefKey]: (e.target as HTMLInputElement).checked,
        },
      }));
    } else if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrors({});
    setMessage('');

    const result = profileSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path.join('.')] = err.message;
        }
      });
      setErrors(fieldErrors);
      setStatus('idle');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || 'Update failed');
        setStatus('error');
        return;
      }

      setMessage('Profile updated successfully');
      setStatus('success');
    } catch {
      setMessage('An error occurred. Please try again.');
      setStatus('error');
    }
  };

  if (loadingProfile) {
    return <div className="text-center py-8">Loading profile...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div className={`p-3 rounded-lg text-sm ${
          status === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            disabled
            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
          />
          <p className="text-xs text-gray-500 mt-1">Contact support to change email</p>
        </div>

        <div>
          <label htmlFor="themePreference" className="block text-sm font-medium text-gray-700 mb-1">
            Theme
          </label>
          <select
            id="themePreference"
            name="themePreference"
            value={formData.themePreference}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <div>
          <label htmlFor="languagePreference" className="block text-sm font-medium text-gray-700 mb-1">
            Language
          </label>
          <select
            id="languagePreference"
            name="languagePreference"
            value={formData.languagePreference}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
          </select>
        </div>

        <div>
          <label htmlFor="timezonePreference" className="block text-sm font-medium text-gray-700 mb-1">
            Timezone
          </label>
          <select
            id="timezonePreference"
            name="timezonePreference"
            value={formData.timezonePreference}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
          >
            <option value="UTC">UTC</option>
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
          </select>
        </div>

        <div>
          <label htmlFor="profileVisibility" className="block text-sm font-medium text-gray-700 mb-1">
            Profile Visibility
          </label>
          <select
            id="profileVisibility"
            name="profileVisibility"
            value={formData.profileVisibility}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notification Preferences
        </label>
        <div className="space-y-2">
          {[
            { key: 'raceCompleted', label: 'Race completed' },
            { key: 'draftTurn', label: 'My draft turn' },
            { key: 'invitations', label: 'League invitations' },
            { key: 'teamUpdates', label: 'Team updates' },
            { key: 'pointsUpdated', label: 'Points updated' },
          ].map((item) => (
            <label key={item.key} className="flex items-center">
              <input
                type="checkbox"
                name={`notification_${item.key}`}
                checked={formData.notificationPreferences[item.key as keyof typeof formData.notificationPreferences]}
                onChange={handleChange}
                className="mr-2 h-4 w-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
              />
              <span className="text-sm text-gray-700">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            name="showEmailToLeagueMembers"
            checked={formData.showEmailToLeagueMembers}
            onChange={handleChange}
            className="mr-2 h-4 w-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
          />
          <span className="text-sm text-gray-700">Show email to league members</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
      >
        {status === 'loading' ? 'Saving...' : 'Save Profile'}
      </button>
    </form>
  );
}
