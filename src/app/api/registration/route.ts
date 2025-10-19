import { NextRequest, NextResponse } from 'next/server';

// Mock database - in production, use a real database
interface Registration {
  id: number;
  child_name: string;
  child_gender: string;
  child_birth_place: string;
  child_birth_date: string;
  child_school: string;
  child_address: string;
  child_complaint: string;
  child_service_choice: string;
  email: string;
  guardian_name: string;
  guardian_phone: string;
  guardian_type: string;
  status: string;
  createdAt: Date;
}

const registrations: Registration[] = [];

export async function POST(request: NextRequest) {
  try {
    const {
      child_name,
      child_gender,
      child_birth_place,
      child_birth_date,
      child_school,
      child_address,
      child_complaint,
      child_service_choice,
      email,
      guardian_name,
      guardian_phone,
      guardian_type
    } = await request.json();

    // Validation
    if (!child_name || !child_gender || !child_birth_date || !email || !guardian_name || !guardian_phone) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      );
    }

    // Validate gender
    if (!['laki-laki', 'perempuan'].includes(child_gender)) {
      return NextResponse.json(
        { error: 'Gender must be either "laki-laki" or "perempuan"' },
        { status: 400 }
      );
    }

    // Validate guardian type
    if (!['ayah', 'ibu', 'wali'].includes(guardian_type)) {
      return NextResponse.json(
        { error: 'Guardian type must be either "ayah", "ibu", or "wali"' },
        { status: 400 }
      );
    }

    // Create new registration
    const newRegistration = {
      id: registrations.length + 1,
      child_name,
      child_gender,
      child_birth_place,
      child_birth_date,
      child_school,
      child_address,
      child_complaint,
      child_service_choice,
      email,
      guardian_name,
      guardian_phone,
      guardian_type,
      status: 'pending', // pending, approved, rejected
      createdAt: new Date()
    };

    registrations.push(newRegistration);

    return NextResponse.json({
      message: 'Registration submitted successfully',
      registration: newRegistration
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}