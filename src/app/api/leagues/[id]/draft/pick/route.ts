import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const pickSchema = z.object({
  driverId: z.string(),
});

// POST /api/leagues/[id]/draft/pick - Make a draft pick
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { driverId } = pickSchema.parse(body);

    // TODO: Database - Get league draft status
    // TODO: Database - Verify it's current user's turn
    // TODO: Database - Check driver hasn't been picked
    // TODO: Database - Validate roster rules (max 5 drivers, 1 per team, max 2 per nationality)
    // TODO: Database - Create pick record
    // TODO: Database - Update turn to next team
    // TODO: Database - Check if draft complete
    // TODO: Database - Create activity log entry

    return NextResponse.json({
      message: 'Pick successful',
      pick: {
        id: `pick-${Date.now()}`,
        round: 4,
        pick: 3,
        teamId: 'team-1',
        driverId,
        selectedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
    }
    console.error('Draft pick error:', error);
    return NextResponse.json({ error: 'Failed to make pick' }, { status: 500 });
  }
}
