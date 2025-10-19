import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mock database - in production, use a real database
interface User {
  id: number;
  email: string;
  username: string;
  password: string;
  emailVerified: boolean;
  role: string;
  createdAt: Date;
}

interface ResetToken {
  token: string;
  userId: number;
  email: string;
  expiresAt: Date;
}

const users: User[] = [];
const resetTokens: ResetToken[] = [];

export async function POST(request: NextRequest) {
  try {
    const { password, password_confirmation, token, email } = await request.json();

    // Validation
    if (!password || !password_confirmation || !token || !email) {
      return NextResponse.json(
        { error: 'Password, password confirmation, token, and email are required' },
        { status: 400 }
      );
    }

    if (password !== password_confirmation) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Verify reset token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: number; email: string };
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Check if token matches email
    if (decoded.email !== email) {
      return NextResponse.json(
        { error: 'Invalid token for this email' },
        { status: 401 }
      );
    }

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user password
    user.password = hashedPassword;

    // Remove used reset token
    const tokenIndex = resetTokens.findIndex(rt => rt.token === token);
    if (tokenIndex > -1) {
      resetTokens.splice(tokenIndex, 1);
    }

    return NextResponse.json({
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}