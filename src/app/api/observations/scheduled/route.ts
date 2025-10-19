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

const users: User[] = [];
const observations: Observation[] = [];

// Helper function to verify therapist or admin token
function verifyTherapistToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: number; email: string; username: string; role: string };
    const user = users.find(u => u.id === decoded.userId);
    if (!user || !['therapist', 'admin'].includes(user.role)) {
      return null;
    }
    return user;
  } catch (error) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const therapistUser = verifyTherapistToken(request);
    if (!therapistUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const scheduledObservations = observations.filter(obs => obs.status === 'scheduled');

    // If therapist, only show their observations
    const filteredObservations = therapistUser.role === 'therapist'
      ? scheduledObservations.filter(obs => obs.therapist_id === therapistUser.id)
      : scheduledObservations;

    return NextResponse.json({
      observations: filteredObservations
    });

  } catch (error) {
    console.error('Get scheduled observations error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}