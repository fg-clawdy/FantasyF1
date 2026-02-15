import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(30),
  password: z.string().min(8),
  fullName: z.string().min(1).max(100),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    // TODO: Database - Check if email already exists
    // TODO: Database - Check if username already exists
    
    // Hash password
    // Note: passwordHash will be used when database is connected
    const _passwordHash = await bcrypt.hash(validatedData.password, 12);
    
    // TODO: Database - Create user with validated: false
    // TODO: Generate validation token
    // TODO: Send validation email via Resend
    
    return NextResponse.json({
      message: 'Registration successful. Please check your email to validate your account.',
      status: 'pending_validation',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
