'use client';

import { useState } from 'react';

const draftMethods = [
  { value: 'snake', label: 'Snake Draft', description: 'Order reverses each round' },
  { value: 'sequential', label: 'Sequential', description: 'Same order every round' },
  { value: 'random', label: 'Random', description: 'Random order each round' },
];

const draftCloseConditions = [
  { value: 'FP1', label: 'After FP1' },
  { value: 'FP2', label: 'After FP2' },
  { value: 'FP3', label: 'After FP3' },
  { value: 'qualifying', label: 'After Qualifying' },
  { value: 'manual', label: 'Manual' },
];

interface LeagueFormProps {
  onSuccess?: (leagueId: string) => void;
}

export function LeagueForm({ onSuccess }: LeagueFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    privacy: 'public' as 'public' | 'private',
    size: 8,
    draftMethod: 'snake' as 'snake' | 'sequential' | 'random',
    draftCloseCondition: 'qualifying' as 'FP1' | 'FP2' | 'FP3' | 'qualifying' | 'manual',
    pickTimer: 60,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'number' ? parseInt(value) : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name || formData.name.length < 3) {
      newErrors.name = 'League name must be at least 3 characters';
    }
    if (formData.size < 2 || formData.size > 10) {
      newErrors.size = 'League size must be between 2 and 10';
    }
    if (formData.pickTimer < 30 || formData.pickTimer > 180) {
      newErrors.pickTimer = 'Pick timer must be between 30 and 180 seconds';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('loading');
    setMessage('');

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/leagues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || 'Failed to create league');
        setStatus('error');
        return;
      }

      setMessage('League created successfully!');
      setStatus('success');
      onSuccess?.(data.league.id);
    } catch {
      setMessage('An error occurred. Please try again.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
        <h2 className="text-xl font-semibold text-green-800 mb-2">League Created!</h2>
        <p className="text-green-700 mb-4">{message}</p>
        <p className="text-sm text-green-600">
          League Code: <span className="font-mono font-bold">Will be generated</span>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && status === 'error' && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {message}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          League Name *
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="F1 Champions 2026"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
          placeholder="A brief description of your league..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="privacy" className="block text-sm font-medium text-gray-700 mb-1">
            Privacy
          </label>
          <select
            id="privacy"
            name="privacy"
            value={formData.privacy}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>

        <div>
          <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
            League Size
          </label>
          <select
            id="size"
            name="size"
            value={formData.size}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 ${
              errors.size ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            {[2, 4, 6, 8, 10].map((n) => (
              <option key={n} value={n}>{n} teams</option>
            ))}
          </select>
          {errors.size && <p className="text-red-500 text-xs mt-1">{errors.size}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Draft Method</label>
        <div className="grid grid-cols-3 gap-3">
          {draftMethods.map((method) => (
            <label
              key={method.value}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                formData.draftMethod === method.value
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="draftMethod"
                value={method.value}
                checked={formData.draftMethod === method.value}
                onChange={handleChange}
                className="sr-only"
              />
              <p className="font-medium text-sm">{method.label}</p>
              <p className="text-xs text-gray-500">{method.description}</p>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="draftCloseCondition" className="block text-sm font-medium text-gray-700 mb-1">
            Draft Closes
          </label>
          <select
            id="draftCloseCondition"
            name="draftCloseCondition"
            value={formData.draftCloseCondition}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
          >
            {draftCloseConditions.map((cond) => (
              <option key={cond.value} value={cond.value}>{cond.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="pickTimer" className="block text-sm font-medium text-gray-700 mb-1">
            Pick Timer (seconds)
          </label>
          <input
            id="pickTimer"
            name="pickTimer"
            type="number"
            min="30"
            max="180"
            value={formData.pickTimer}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 ${
              errors.pickTimer ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.pickTimer && <p className="text-red-500 text-xs mt-1">{errors.pickTimer}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
      >
        {status === 'loading' ? 'Creating League...' : 'Create League'}
      </button>
    </form>
  );
}
