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

interface ObservationAnswer {
  id: number;
  observation_id: number;
  therapist_id: number;
  answers: Array<{
    question_id: number;
    answer: boolean;
    note: string;
  }>;
  conclusion: string;
  recommendation: string;
  therapy_types: {
    fisio: boolean;
    wicara: boolean;
    paedagog: boolean;
    okupasi: boolean;
  };
  submitted_at: Date;
}

const users: User[] = [];
const observations: Observation[] = [];
const observationAnswers: ObservationAnswer[] = [];

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

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ observation_id: string }> }
) {
  try {
    const therapistUser = verifyTherapistToken(request);
    if (!therapistUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { observation_id } = await context.params;
    const { answers, conclusion, recommendation, fisio, wicara, paedagog, okupasi } = await request.json();

    // Validation
    if (!answers || !Array.isArray(answers) || !conclusion || !recommendation) {
      return NextResponse.json(
        { error: 'Answers, conclusion, and recommendation are required' },
        { status: 400 }
      );
    }

    // Find observation
    const observation = observations.find(obs => obs.id === parseInt(observation_id));
    if (!observation) {
      return NextResponse.json(
        { error: 'Observation not found' },
        { status: 404 }
      );
    }

    // Check if therapist has access to this observation
    if (therapistUser.role === 'therapist' && observation.therapist_id !== therapistUser.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Validate answers format
    for (const answer of answers) {
      if (!answer.question_id || typeof answer.answer !== 'boolean' || !answer.note) {
        return NextResponse.json(
          { error: 'Invalid answer format' },
          { status: 400 }
        );
      }
    }

    // Store observation answers
    const observationAnswer = {
      id: observationAnswers.length + 1,
      observation_id: parseInt(observation_id),
      therapist_id: therapistUser.id,
      answers: answers,
      conclusion,
      recommendation,
      therapy_types: {
        fisio: fisio || false,
        wicara: wicara || false,
        paedagog: paedagog || false,
        okupasi: okupasi || false
      },
      submitted_at: new Date()
    };

    observationAnswers.push(observationAnswer);

    // Update observation status to completed
    observation.status = 'completed';
    observation.completed_at = new Date();

    return NextResponse.json({
      message: 'Observation submitted successfully',
      observation_answer: observationAnswer
    });

  } catch (error) {
    console.error('Submit observation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}