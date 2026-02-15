import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const VALIDATION_TOKEN_EXPIRY = 24 * 60 * 60; // 24 hours in seconds

export interface ValidationTokenPayload {
  userId: string;
  email: string;
  type: 'email_validation' | 'password_reset';
}

export function generateValidationToken(userId: string, email: string): string {
  const payload: ValidationTokenPayload = {
    userId,
    email,
    type: 'email_validation',
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: VALIDATION_TOKEN_EXPIRY });
}

export function verifyValidationToken(token: string): ValidationTokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as ValidationTokenPayload;
    return decoded;
  } catch {
    return null;
  }
}

export function generatePasswordResetToken(userId: string, email: string): string {
  const payload: ValidationTokenPayload = {
    userId,
    email,
    type: 'password_reset',
  };
  
  // Password reset tokens expire in 1 hour
  return jwt.sign(payload, JWT_SECRET, { expiresIn: 60 * 60 });
}
