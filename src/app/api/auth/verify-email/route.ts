import { NextRequest, NextResponse } from 'next/server';
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

const users: User[] = [];

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: number; email: string };
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Find user
    const user = users.find(u => u.id === decoded.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user verification status
    user.emailVerified = true;

    return NextResponse.json({
      message: 'Email verified successfully'
    });

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}