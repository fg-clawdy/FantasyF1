import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const PUBLIC_PATHS = ['/api/auth/login', '/api/auth/register', '/api/auth/refresh'];

interface TokenPayload {
  userId: string;
  email: string;
  username: string;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Allow non-API routes (they'll be handled by client-side)
  if (!pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Check for access token
  const authHeader = request.headers.get('authorization');
  const accessToken = authHeader?.replace('Bearer ', '');

  if (!accessToken) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  try {
    const decoded = jwt.verify(accessToken, JWT_SECRET);
    
    // Add user info to request headers for downstream use
    const requestHeaders = new Headers(request.headers);
    const payload = decoded as TokenPayload;
    requestHeaders.set('x-user-id', payload.userId);
    requestHeaders.set('x-user-email', payload.email);
    requestHeaders.set('x-user-username', payload.username);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: '/api/:path*',
};
