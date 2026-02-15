import { NextRequest, NextResponse } from 'next/server';
import { verifyValidationToken } from '@/lib/auth/validation';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  
  if (!token) {
    return NextResponse.json(
      { error: 'Validation token is required' },
      { status: 400 }
    );
  }
  
  const payload = verifyValidationToken(token);
  
  if (!payload) {
    return NextResponse.json(
      { error: 'Invalid or expired validation token' },
      { status: 400 }
    );
  }
  
  if (payload.type !== 'email_validation') {
    return NextResponse.json(
      { error: 'Invalid token type' },
      { status: 400 }
    );
  }
  
  // TODO: Database - Update user to validated: true
  // TODO: Database - Remove validation token
  
  return NextResponse.json({
    message: 'Email validated successfully',
    email: payload.email,
  });
}
