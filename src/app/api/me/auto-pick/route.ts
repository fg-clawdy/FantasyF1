import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const autoPickSchema = z.object({
  enabled: z.boolean(),
  strategy: z.enum(['highest_ranked', 'most_points', 'best_value']),
});

// GET /api/me/auto-pick - Get auto-pick settings
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Database - Fetch auto-pick settings
    
    // Simulated response
    const autoPick = {
      enabled: false,
      strategy: 'best_value',
    };

    return NextResponse.json({ autoPick });
  } catch (error) {
    console.error('Get auto-pick error:', error);
    return NextResponse.json({ error: 'Failed to fetch auto-pick settings' }, { status: 500 });
  }
}

// PATCH /api/me/auto-pick - Update auto-pick settings
export async function PATCH(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = autoPickSchema.parse(body);

    // TODO: Database - Update auto-pick settings

    return NextResponse.json({
      message: 'Auto-pick settings updated',
      autoPick: validatedData,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
    }
    console.error('Update auto-pick error:', error);
    return NextResponse.json({ error: 'Failed to update auto-pick settings' }, { status: 500 });
  }
}
