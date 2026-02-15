'use client';

import { useState } from 'react';
import { z } from 'zod';

const joinSchema = z.object({
  code: z.string().length(6, 'League code must be 6 characters').toUpperCase(),
});

interface JoinFormProps {
  onSuccess?: () => void;
}

export function JoinForm({ onSuccess }: JoinFormProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const result = joinSchema.safeParse({ code });
    if (!result.success) {
      setError(result.error.issues[0]?.message || 'Invalid code');
      return;
    }

    setStatus('loading');

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/leagues/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code: code.toUpperCase() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || 'Failed to join league');
        setStatus('error');
        return;
      }

      setMessage('Successfully joined league!');
      setStatus('success');
      onSuccess?.();
    } catch {
      setMessage('An error occurred. Please try again.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
        <h2 className="text-xl font-semibold text-green-800 mb-2">Joined!</h2>
        <p className="text-green-700">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && status === 'error' && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {message}
        </div>
      )}

      <div>
        <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
          League Code
        </label>
        <input
          id="code"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          maxLength={6}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 uppercase font-mono text-center text-lg tracking-widest ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="ABC123"
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        <p className="text-xs text-gray-500 mt-1">Enter the 6-character code shared by the league admin</p>
      </div>

      <button
        type="submit"
        disabled={status === 'loading' || code.length !== 6}
        className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? 'Joining...' : 'Join League'}
      </button>
    </form>
  );
}
