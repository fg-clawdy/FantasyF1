import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRY = 15 * 60; // 15 minutes in seconds
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 days in seconds

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

interface TokenPayload {
  userId: string;
  email: string;
  username: string;
}

function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = loginSchema.parse(body);

    // TODO: Database - Find user by email
    // TODO: Database - Check if email is validated
    
    // TODO: Rate limiting - Check failed attempts (5 per IP per hour)
    // TODO: Account lockout - Check if account is locked after 10 failed attempts
    
    // For now, simulate login (database not connected yet)
    // This will be replaced with actual database lookup
    
    // const user = await db.user.findUnique({ where: { email: validatedData.email } });
    // if (!user) { return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 }); }
    // if (!user.validated) { return NextResponse.json({ error: 'Email not validated' }, { status: 401 }); }
    
    // const passwordValid = await bcrypt.compare(validatedData.password, user.passwordHash);
    // if (!passwordValid) {
    //   // TODO: Increment failed attempts
    //   return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    // }

    // Simulated response for now
    const mockUser = {
      id: 'user-123',
      email: validatedData.email,
      username: 'testuser',
    };

    const payload: TokenPayload = {
      userId: mockUser.id,
      email: mockUser.email,
      username: mockUser.username,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Set refresh token as httpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: REFRESH_TOKEN_EXPIRY,
      path: '/',
    });

    return NextResponse.json({
      accessToken,
      user: {
        id: mockUser.id,
        email: mockUser.email,
        username: mockUser.username,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
