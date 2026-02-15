import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const draftOrderSchema = z.object({
  method: z.enum(['sequential', 'snake', 'random', 'manual']),
  order: z.array(z.string()).optional(), // For manual method
});

// GET /api/leagues/[id]/draft/order - Get draft order
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // TODO: Database - Get draft order for league

    return NextResponse.json({
      method: 'snake',
      order: ['team-1', 'team-2', 'team-3', 'team-4'],
      round: 1,
    });
  } catch (error) {
    console.error('Get draft order error:', error);
    return NextResponse.json({ error: 'Failed to get draft order' }, { status: 500 });
  }
}

// POST /api/leagues/[id]/draft/order - Create/set draft order
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { method, order } = draftOrderSchema.parse(body);

    // TODO: Database - Check user is league admin
    // TODO: Database - Generate order based on method
    // TODO: Database - Store draft order per race
    // TODO: Database - Create activity log entry

    let finalOrder: string[];
    
    switch (method) {
      case 'random':
        finalOrder = ['team-1', 'team-2', 'team-3', 'team-4'].sort(() => Math.random() - 0.5);
        break;
      case 'snake':
        // A-B-C-D-D-C-B-A pattern for 2 rounds
        finalOrder = ['team-1', 'team-2', 'team-3', 'team-4', 'team-4', 'team-3', 'team-2', 'team-1'];
        break;
      case 'manual':
        finalOrder = order || [];
        break;
      default: // sequential
        finalOrder = ['team-1', 'team-2', 'team-3', 'team-4'];
    }

    return NextResponse.json({
      message: 'Draft order set',
      method,
      order: finalOrder,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
    }
    console.error('Set draft order error:', error);
    return NextResponse.json({ error: 'Failed to set draft order' }, { status: 500 });
  }
}
