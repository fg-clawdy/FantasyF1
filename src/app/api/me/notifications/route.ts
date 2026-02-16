import { NextRequest, NextResponse } from 'next/server';

// GET /api/me/notifications - List user notifications
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const type = request.nextUrl.searchParams.get('type');
    const unreadOnly = request.nextUrl.searchParams.get('unread') === 'true';

    // TODO: Database - Query notifications by user ID
    // TODO: Filter by type if provided
    // TODO: Filter by read status if unreadOnly

    const notifications = [
      { id: 'notif-1', type: 'draft_turn', title: "It's your turn to pick!", message: 'Round 4 pick 3 is now open', read: false, createdAt: '2026-02-15T14:30:00Z', link: '/leagues/league-1/draft' },
      { id: 'notif-2', type: 'invitation_received', title: 'League Invitation', message: 'You have been invited to join F1 Fanatics', read: false, createdAt: '2026-02-15T10:00:00Z', link: '/invitations' },
      { id: 'notif-3', type: 'race_completed', title: 'Race Completed', message: 'Bahrain GP results are in - you earned 87 points!', read: true, createdAt: '2026-02-15T18:00:00Z', link: '/races/race-1/results' },
      { id: 'notif-4', type: 'points_updated', title: 'Points Updated', message: 'Your total points are now 332', read: true, createdAt: '2026-02-15T18:05:00Z', link: '/leagues/league-1/leaderboard' },
    ];

    let filtered = notifications;
    if (type) filtered = filtered.filter((n) => n.type === type);
    if (unreadOnly) filtered = filtered.filter((n) => !n.read);

    const unreadCount = notifications.filter((n) => !n.read).length;

    return NextResponse.json({ notifications: filtered, unreadCount });
  } catch (error) {
    console.error('Get notifications error:', error);
    return NextResponse.json({ error: 'Failed to get notifications' }, { status: 500 });
  }
}

// PATCH /api/me/notifications - Mark notifications as read
export async function PATCH(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { notificationIds, markAllRead } = body;

    // TODO: Database - Mark notifications as read

    return NextResponse.json({ message: 'Notifications marked as read' });
  } catch (error) {
    console.error('Mark read error:', error);
    return NextResponse.json({ error: 'Failed to mark notifications as read' }, { status: 500 });
  }
}