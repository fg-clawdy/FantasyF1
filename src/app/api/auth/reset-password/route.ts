import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyValidationToken, generatePasswordResetToken } from '@/lib/auth/validation';
import { hashPassword } from '@/lib/auth/password';

const resetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

// Strong password validation
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
const strongPasswordSchema = z.string().refine(
  (password) => passwordRegex.test(password),
  'Password must contain at least one uppercase, lowercase, number, and special character'
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = resetPasswordSchema.parse(body);

    // Validate password strength
    strongPasswordSchema.parse(validatedData.newPassword);

    // Verify the token
    const payload = verifyValidationToken(validatedData.token);
    
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    if (payload.type !== 'password_reset') {
      return NextResponse.json(
        { error: 'Invalid token type' },
        { status: 400 }
      );
    }

    // Hash the new password
    const _newPasswordHash = await hashPassword(validatedData.newPassword);

    // TODO: Database - Update user password
    // TODO: Database - Invalidate all existing sessions/tokens
    // TODO: Database - Remove used reset token (single-use)

    // Simulated response
    // await db.user.update({
    //   where: { id: payload.userId },
    //   data: { passwordHash: newPasswordHash }
    // });
    // await db.passwordResetToken.deleteMany({ where: { userId: payload.userId } });

    return NextResponse.json({
      message: 'Password reset successful. Please log in with your new password.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Password reset failed' },
      { status: 500 }
    );
  }
}
