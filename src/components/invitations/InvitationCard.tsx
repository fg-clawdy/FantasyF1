'use client';

import { useState } from 'react';

interface InvitationCardProps {
  invitation: {
    id: string;
    league: {
      id: string;
      name: string;
      creator: { username: string };
    };
    status: string;
    message?: string;
    expiresAt: string;
    createdAt: string;
  };
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
}

export function InvitationCard({ invitation, onAccept, onReject }: InvitationCardProps) {
  const [status, setStatus] = useState<'idle' | 'loading'>('idle');
  const isExpired = new Date(invitation.expiresAt) < new Date();
  const isPending = invitation.status === 'pending' && !isExpired;

  const handleAccept = async () => {
    setStatus('loading');
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/me/invitations/${invitation.id}/accept`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        onAccept?.(invitation.id);
      }
    } catch (error) {
      console.error('Accept error:', error);
    } finally {
      setStatus('idle');
    }
  };

  const handleReject = async () => {
    setStatus('loading');
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/me/invitations/${invitation.id}/reject`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        onReject?.(invitation.id);
      }
    } catch (error) {
      console.error('Reject error:', error);
    } finally {
      setStatus('idle');
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-lg">{invitation.league.name}</h3>
          <p className="text-sm text-gray-500">Invited by {invitation.league.creator.username}</p>
        </div>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            isExpired
              ? 'bg-gray-100 text-gray-600'
              : invitation.status === 'accepted'
              ? 'bg-green-100 text-green-700'
              : invitation.status === 'rejected'
              ? 'bg-red-100 text-red-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}
        >
          {isExpired ? 'Expired' : invitation.status}
        </span>
      </div>

      {invitation.message && (
        <p className="text-sm text-gray-600 mb-3 italic">&quot;{invitation.message}&quot;</p>
      )}

      <p className="text-xs text-gray-400 mb-3">
        Expires: {new Date(invitation.expiresAt).toLocaleDateString()}
      </p>

      {isPending && (
        <div className="flex gap-2">
          <button
            onClick={handleAccept}
            disabled={status === 'loading'}
            className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            Accept
          </button>
          <button
            onClick={handleReject}
            disabled={status === 'loading'}
            className="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
}
