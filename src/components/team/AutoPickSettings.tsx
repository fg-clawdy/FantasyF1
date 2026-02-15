'use client';

import { useState, useEffect } from 'react';

type Strategy = 'highest_ranked' | 'most_points' | 'best_value';

interface AutoPickSettings {
  enabled: boolean;
  strategy: Strategy;
}

export function AutoPickSettings() {
  const [settings, setSettings] = useState<AutoPickSettings>({
    enabled: false,
    strategy: 'best_value',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchSettings() {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch('/api/me/auto-pick', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (response.ok) {
          const data = await response.json();
          setSettings(data.autoPick);
        }
      } catch (error) {
        console.error('Failed to fetch auto-pick settings:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchSettings();
  }, []);

  const handleToggle = () => {
    setSettings((prev) => ({ ...prev, enabled: !prev.enabled }));
  };

  const handleStrategyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSettings((prev) => ({ ...prev, strategy: e.target.value as Strategy }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/me/auto-pick', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setMessage('Auto-pick settings saved');
      } else {
        setMessage('Failed to save settings');
      }
    } catch {
      setMessage('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Auto-Pick Settings</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Enable Auto-Pick</p>
            <p className="text-sm text-gray-500">Automatically pick when it is your turn and timer expires</p>
          </div>
          <button
            onClick={handleToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.enabled ? 'bg-red-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div>
          <label htmlFor="strategy" className="block text-sm font-medium text-gray-700 mb-1">
            Pick Strategy
          </label>
          <select
            id="strategy"
            value={settings.strategy}
            onChange={handleStrategyChange}
            disabled={!settings.enabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="best_value">Best Value (highest points per price)</option>
            <option value="highest_ranked">Highest Ranked (best driver overall)</option>
            <option value="most_points">Most Points (most total points)</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            {settings.strategy === 'best_value' && 'Pick the driver with the best points-to-price ratio'}
            {settings.strategy === 'highest_ranked' && 'Pick the highest-ranked driver within your budget'}
            {settings.strategy === 'most_points' && 'Pick the driver with most total season points'}
          </p>
        </div>

        {message && (
          <p className={`text-sm ${message.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </p>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
