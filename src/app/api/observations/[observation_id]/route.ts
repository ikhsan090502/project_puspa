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

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ observation_id: string }> }
) {
  try {
    const adminUser = verifyAdminToken(request);
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { observation_id } = await context.params;
    const updateData = await request.json();

    // Find observation
    const observationIndex = observations.findIndex(obs => obs.id === parseInt(observation_id));
    if (observationIndex === -1) {
      return NextResponse.json(
        { error: 'Observation not found' },
        { status: 404 }
      );
    }

    // Check if this is a PUT request (update)
    if (updateData._method === 'PUT') {
      const { _method: _putMethod, ...updateFields } = updateData;

      // Validate fields that can be updated
      const allowedFields = ['scheduled_date'];
      const filteredFields: { scheduled_date?: string } = {};

      allowedFields.forEach(field => {
        if (field === 'scheduled_date' && updateFields[field] !== undefined) {
          filteredFields.scheduled_date = updateFields[field];
        }
      });

      // Update observation
      observations[observationIndex] = { ...observations[observationIndex], ...filteredFields };

      return NextResponse.json({
        message: 'Observation updated successfully',
        observation: observations[observationIndex]
      });
    }

    return NextResponse.json(
      { error: 'Invalid method' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Update observation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}