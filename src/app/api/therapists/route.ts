import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

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
const therapists: Therapist[] = [];

// Helper function to verify admin token
function verifyAdminToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: number; email: string; username: string; role: string };
    const user = users.find(u => u.id === decoded.userId);
    if (!user || user.role !== 'admin') {
      return null;
    }
    return user;
  } catch (error) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const adminUser = verifyAdminToken(request);
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      therapists: therapists
    });

  } catch (error) {
    console.error('Get therapists error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminUser = verifyAdminToken(request);
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { username, email, password, therapist_name, therapist_phone, therapist_section } = await request.json();

    // Validation
    if (!username || !email || !password || !therapist_name || !therapist_section) {
      return NextResponse.json(
        { error: 'Username, email, password, therapist name, and section are required' },
        { status: 400 }
      );
    }

    // Validate section
    if (!['okupasi', 'wicara', 'fisio', 'paedagog'].includes(therapist_section)) {
      return NextResponse.json(
        { error: 'Therapist section must be one of: okupasi, wicara, fisio, paedagog' },
        { status: 400 }
      );
    }

    // Check if therapist already exists
    const existingTherapist = therapists.find(therapist => therapist.email === email || therapist.username === username);
    if (existingTherapist) {
      return NextResponse.json(
        { error: 'Therapist with this email or username already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new therapist
    const newTherapist = {
      id: therapists.length + 1,
      username,
      email,
      password: hashedPassword,
      therapist_name,
      therapist_phone,
      therapist_section,
      role: 'therapist',
      emailVerified: false,
      createdAt: new Date()
    };

    therapists.push(newTherapist);

    // Also add to users array for authentication
    users.push({
      id: newTherapist.id,
      email: newTherapist.email,
      username: newTherapist.username,
      password: newTherapist.password,
      role: 'therapist',
      emailVerified: false,
      createdAt: new Date()
    });

    // Return therapist without password
    const { password: _password, ...therapistWithoutPassword } = newTherapist;

    return NextResponse.json({
      message: 'Therapist created successfully',
      therapist: therapistWithoutPassword
    });

  } catch (error) {
    console.error('Create therapist error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}