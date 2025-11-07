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

interface Observation {
  id: number;
  child_id: number;
  therapist_id: number;
  status: string;
  scheduled_date: string;
  completed_at?: Date;
  createdAt: Date;
}

interface ObservationQuestion {
  id: number;
  question: string;
  age_group: string;
  category: string;
}

const users: User[] = [];
const observations: Observation[] = [];
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const observationQuestions: ObservationQuestion[] = [];

// Helper function to verify token and role
function verifyTokenWithRole(request: NextRequest, allowedRoles: string[]) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: number; email: string; username: string; role: string };
    const user = users.find(u => u.id === decoded.userId);
    if (!user || !allowedRoles.includes(user.role)) {
      return null;
    }
    return user;
  } catch (error) {
    return null;
  }
}

// Helper function to verify admin token
function verifyAdminToken(request: NextRequest) {
  return verifyTokenWithRole(request, ['admin']);
}

// Helper function to verify therapist token
function verifyTherapistToken(request: NextRequest) {
  return verifyTokenWithRole(request, ['therapist', 'admin']);
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');

    // Check if user is admin or therapist
    const adminUser = verifyAdminToken(request);
    const therapistUser = verifyTherapistToken(request);

    if (!adminUser && !therapistUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    let filteredObservations = observations;

    // Filter by status if provided
    if (status) {
      if (status === 'pending') {
        filteredObservations = observations.filter(obs => obs.status === 'pending');
      } else if (status === 'scheduled') {
        filteredObservations = observations.filter(obs => obs.status === 'scheduled');
      } else if (status === 'completed') {
        filteredObservations = observations.filter(obs => obs.status === 'completed');
      }
    }

    // If therapist, only show their observations
    if (therapistUser && therapistUser.role === 'therapist') {
      filteredObservations = filteredObservations.filter(obs => obs.therapist_id === therapistUser.id);
    }

    return NextResponse.json({
      observations: filteredObservations
    });

  } catch (error) {
    console.error('Get observations error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}