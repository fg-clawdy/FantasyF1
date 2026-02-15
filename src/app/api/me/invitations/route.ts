import { NextRequest, NextResponse } from 'next/server';

// GET /api/me/invitations - List user's invitations
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const status = request.nextUrl.searchParams.get('status');

    // TODO: Database - Query invitations by invited user ID
    // TODO: Database - Filter by status if provided

    // Simulated data
    const invitations = [
      {
        id: 'invite-1',
        league: {
          id: 'league-1',
          name: 'F1 Fanatics',
          creator: { username: 'max_fan' },
        },
        status: 'pending',
        message: 'Join our league!',
        expiresAt: '2026-02-22T10:00:00Z',
        createdAt: '2026-02-15T10:00:00Z',
      },
      {
        id: 'invite-2',
        league: {
          id: 'league-2',
          name: 'Racing Legends',
          creator: { username: 'lewis_fan' },
        },
        status: 'pending',
        message: 'Come race with us!',
        expiresAt: '2026-02-20T14:00:00Z',
        createdAt: '2026-02-13T14:00:00Z',
      },
    ];

    const filtered = status ? invitations.filter((i) => i.status === status) : invitations;

    return NextResponse.json({ invitations: filtered });
  } catch (error) {
    console.error('Get invitations error:', error);
    return NextResponse.json({ error: 'Failed to get invitations' }, { status: 500 });
  }
}
