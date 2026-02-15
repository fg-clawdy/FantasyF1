import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const profileSchema = z.object({
  fullName: z.string().min(1).max(100).optional(),
  username: z.string().min(3).max(30).optional(),
  // Email change requires re-validation
  email: z.string().email().optional(),
  notificationPreferences: z.object({
    raceCompleted: z.boolean().optional(),
    draftTurn: z.boolean().optional(),
    invitations: z.boolean().optional(),
    teamUpdates: z.boolean().optional(),
    pointsUpdated: z.boolean().optional(),
  }).optional(),
  themePreference: z.enum(['light', 'dark', 'system']).optional(),
  languagePreference: z.string().max(10).optional(),
  timezonePreference: z.string().max(50).optional(),
  profileVisibility: z.enum(['public', 'private']).optional(),
  showEmailToLeagueMembers: z.boolean().optional(),
});

// PATCH /api/me - Update current user's profile
export async function PATCH(request: NextRequest) {
  try {
    // Get user ID from auth middleware
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = profileSchema.parse(body);

    // TODO: Database - Check if username is already taken (if changing)
    // TODO: Database - Check if email is already taken (if changing)
    // TODO: If email is changing, mark email as unvalidated and send new validation email
    
    // Simulated response
    // const updatedUser = await db.user.update({
    //   where: { id: userId },
    //   data: { ...validatedData }
    // });

    return NextResponse.json({
      message: 'Profile updated successfully',
      // user: updatedUser
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Profile update failed' },
      { status: 500 }
    );
  }
}

// GET /api/me - Get current user's profile
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Database - Fetch user profile
    
    // Simulated response
    const user = {
      id: userId,
      email: 'user@example.com',
      username: 'testuser',
      fullName: 'Test User',
      validated: true,
      notificationPreferences: {
        raceCompleted: true,
        draftTurn: true,
        invitations: true,
        teamUpdates: false,
        pointsUpdated: true,
      },
      themePreference: 'system',
      languagePreference: 'en',
      timezonePreference: 'UTC',
      profileVisibility: 'public',
      showEmailToLeagueMembers: false,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}
