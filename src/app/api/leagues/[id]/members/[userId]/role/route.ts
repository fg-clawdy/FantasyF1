import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const roleSchema = z.object({
  role: z.enum(['admin', 'member']),
});

// PATCH /api/leagues/[id]/members/[userId]/role - Update member role
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string; userId: string }> }) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, userId: targetUserId } = await params;
    const body = await request.json();
    const { role } = roleSchema.parse(body);

    // TODO: Database - Check current user is admin
    // TODO: Database - Check target user is member of league
    // TODO: Database - Check target user is not the creator (creator can't be demoted)
    // TODO: Database - Count admins, ensure at least 1 remains if demoting
    // TODO: Database - Update role
    // TODO: Database - Create activity log entry

    return NextResponse.json({
      message: `Role updated to ${role}`,
      member: { userId: targetUserId, role },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
    }
    console.error('Update role error:', error);
    return NextResponse.json({ error: 'Failed to update role' }, { status: 500 });
  }
}