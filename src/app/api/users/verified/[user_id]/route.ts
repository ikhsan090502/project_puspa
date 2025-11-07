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

interface Admin {
  id: number;
  username: string;
  email: string;
  password: string;
  admin_name: string;
  admin_phone: string;
  role: string;
  emailVerified: boolean;
  createdAt: Date;
}

interface Therapist {
  id: number;
  username: string;
  email: string;
  password: string;
  therapist_name: string;
  therapist_phone: string;
  therapist_section: string;
  role: string;
  emailVerified: boolean;
  createdAt: Date;
}

const users: User[] = [];
const admins: Admin[] = [];
const therapists: Therapist[] = [];

// Helper function to verify owner token
function verifyOwnerToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: number; email: string; username: string; role: string };
    const user = users.find(u => u.id === decoded.userId);
    if (!user || user.role !== 'owner') {
      return null;
    }
    return user;
  } catch (error) {
    return null;
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ user_id: string }> }
) {
  try {
    const ownerUser = verifyOwnerToken(request);
    if (!ownerUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { user_id } = await context.params;

    // Find user in any role
    let user = users.find(u => u.id === parseInt(user_id));
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user verification status
    user.emailVerified = true;

    // Also update in specific role arrays
    if (user.role === 'admin') {
      const adminIndex = admins.findIndex(a => a.id === parseInt(user_id));
      if (adminIndex !== -1) {
        admins[adminIndex].emailVerified = true;
      }
    } else if (user.role === 'therapist') {
      const therapistIndex = therapists.findIndex(t => t.id === parseInt(user_id));
      if (therapistIndex !== -1) {
        therapists[therapistIndex].emailVerified = true;
      }
    }

    // Return user without password
    const { password: _password, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: 'User verified successfully',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Verify user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}