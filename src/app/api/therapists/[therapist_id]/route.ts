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

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ therapist_id: string }> }
) {
  try {
    const adminUser = verifyAdminToken(request);
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { therapist_id } = await context.params;
    const therapist = therapists.find(t => t.id === parseInt(therapist_id));

    if (!therapist) {
      return NextResponse.json(
        { error: 'Therapist not found' },
        { status: 404 }
      );
    }

    // Return therapist without password
    const { password: _, ...therapistWithoutPassword } = therapist;

    return NextResponse.json({
      therapist: therapistWithoutPassword
    });

  } catch (error) {
    console.error('Get therapist error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ therapist_id: string }> }
) {
  try {
    const adminUser = verifyAdminToken(request);
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { therapist_id } = await context.params;
    const updateData = await request.json();

    // Find therapist
    const therapistIndex = therapists.findIndex(t => t.id === parseInt(therapist_id));
    if (therapistIndex === -1) {
      return NextResponse.json(
        { error: 'Therapist not found' },
        { status: 404 }
      );
    }

    // Check if this is a PUT request (update)
    if (updateData._method === 'PUT') {
      const { _method: _putMethod, ...updateFields } = updateData;

      // Validate fields that can be updated
      const allowedFields = ['email', 'username', 'therapist_name', 'therapist_phone', 'therapist_section'];
      const filteredFields: { email?: string; username?: string; therapist_name?: string; therapist_phone?: string; therapist_section?: string } = {};

      allowedFields.forEach(field => {
        if (field === 'email' && updateFields[field] !== undefined) {
          filteredFields.email = updateFields[field];
        } else if (field === 'username' && updateFields[field] !== undefined) {
          filteredFields.username = updateFields[field];
        } else if (field === 'therapist_name' && updateFields[field] !== undefined) {
          filteredFields.therapist_name = updateFields[field];
        } else if (field === 'therapist_phone' && updateFields[field] !== undefined) {
          filteredFields.therapist_phone = updateFields[field];
        } else if (field === 'therapist_section' && updateFields[field] !== undefined) {
          filteredFields.therapist_section = updateFields[field];
        }
      });

      // Validate section if being updated
      if (filteredFields.therapist_section && !['okupasi', 'wicara', 'fisio', 'paedagog'].includes(filteredFields.therapist_section)) {
        return NextResponse.json(
          { error: 'Therapist section must be one of: okupasi, wicara, fisio, paedagog' },
          { status: 400 }
        );
      }

      // Check if email/username already exists (if being updated)
      if (filteredFields.email || filteredFields.username) {
        const existingTherapist = therapists.find(
          (therapist: Therapist) => therapist.id !== parseInt(therapist_id) &&
          (therapist.email === filteredFields.email || therapist.username === filteredFields.username)
        );
        if (existingTherapist) {
          return NextResponse.json(
            { error: 'Therapist with this email or username already exists' },
            { status: 409 }
          );
        }
      }

      // Update therapist
      therapists[therapistIndex] = { ...therapists[therapistIndex], ...filteredFields };

      // Also update in users array
      const userIndex = users.findIndex(u => u.id === parseInt(therapist_id));
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...filteredFields };
      }

      // Return updated therapist without password
      const { password: _password, ...therapistWithoutPassword } = therapists[therapistIndex];

      return NextResponse.json({
        message: 'Therapist updated successfully',
        therapist: therapistWithoutPassword
      });
    }

    return NextResponse.json(
      { error: 'Invalid method' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Update therapist error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ therapist_id: string }> }
) {
  try {
    const adminUser = verifyAdminToken(request);
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { therapist_id } = await context.params;

    // Find therapist
    const therapistIndex = therapists.findIndex(t => t.id === parseInt(therapist_id));
    if (therapistIndex === -1) {
      return NextResponse.json(
        { error: 'Therapist not found' },
        { status: 404 }
      );
    }

    // Remove therapist from both arrays
    therapists.splice(therapistIndex, 1);
    const userIndex = users.findIndex(u => u.id === parseInt(therapist_id));
    if (userIndex !== -1) {
      users.splice(userIndex, 1);
    }

    return NextResponse.json({
      message: 'Therapist deleted successfully'
    });

  } catch (error) {
    console.error('Delete therapist error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}