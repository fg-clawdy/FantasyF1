import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export interface SendValidationEmailParams {
  email: string;
  token: string;
  fullName: string;
}

export async function sendValidationEmail({
  email,
  token,
  fullName,
}: SendValidationEmailParams) {
  const validationUrl = `${BASE_URL}/auth/validate-email?token=${token}`;
  
  const { data, error } = await resend.emails.send({
    from: 'FantasyF1 <noreply@fantasyf1.app>',
    to: email,
    subject: 'Verify your FantasyF1 account',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .button { display: inline-block; padding: 12px 24px; background: #e10600; color: white; text-decoration: none; border-radius: 4px; }
            .footer { margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Welcome to FantasyF1, ${fullName}!</h1>
            <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
            <p><a href="${validationUrl}" class="button">Verify Email</a></p>
            <p>Or copy and paste this link: ${validationUrl}</p>
            <p>This link expires in 24 hours.</p>
            <div class="footer">
              <p>If you didn't create this account, please ignore this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  });

  if (error) {
    console.error('Resend error:', error);
    throw new Error('Failed to send validation email');
  }

  return data;
}

export interface SendPasswordResetEmailParams {
  email: string;
  token: string;
}

export async function sendPasswordResetEmail({
  email,
  token,
}: SendPasswordResetEmailParams) {
  const resetUrl = `${BASE_URL}/auth/reset-password?token=${token}`;
  
  const { data, error } = await resend.emails.send({
    from: 'FantasyF1 <noreply@fantasyf1.app>',
    to: email,
    subject: 'Reset your FantasyF1 password',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .button { display: inline-block; padding: 12px 24px; background: #e10600; color: white; text-decoration: none; border-radius: 4px; }
            .footer { margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Reset Your Password</h1>
            <p>You requested a password reset. Click the button below to create a new password:</p>
            <p><a href="${resetUrl}" class="button">Reset Password</a></p>
            <p>Or copy and paste this link: ${resetUrl}</p>
            <p>This link expires in 1 hour.</p>
            <div class="footer">
              <p>If you didn't request this, please ignore this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  });

  if (error) {
    console.error('Resend error:', error);
    throw new Error('Failed to send password reset email');
  }

  return data;
}
