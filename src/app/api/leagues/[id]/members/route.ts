import { NextRequest, NextResponse } from 'next/server';

// GET /api/leagues/[id]/members - List league members
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // TODO: Database - Get members for league

    const members = [
      { userId: 'user-1', username: 'max_fan', role: 'admin', team: { id: 'team-1', name: 'My F1 Team' }, joinedAt: '2026-02-01T10:00:00Z' },
      { userId: 'user-2', username: 'lewis_lover', role: 'member', team: { id: 'team-2', name: 'Speed Racing' }, joinedAt: '2026-02-02T14:30:00Z' },
      { userId: 'user-3', username: 'daniel_fan', role: 'member', team: { id: 'team-3', name: 'Turbo Charged' }, joinedAt: '2026-02-03T09:15:00Z' },
    ];

    return NextResponse.json({ members });
  } catch (error) {
    console.error('Get members error:', error);
    return NextResponse.json({ error: 'Failed to get members' }, { status: 500 });
  }
}