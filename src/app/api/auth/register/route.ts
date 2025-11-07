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

const users: User[] = [];

export async function POST(request: NextRequest) {
  try {
    const { email, username, password } = await request.json();

    // Validation
    if (!email || !username || !password) {
      return NextResponse.json(
        { error: 'Email, username, and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = users.find(user => user.email === email || user.username === username);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or username already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = {
      id: users.length + 1,
      email,
      username,
      password: hashedPassword,
      emailVerified: false,
      createdAt: new Date(),
      role: 'user' // Default role
    };

    users.push(newUser);

    // Generate verification token
    const verificationToken = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // In production, send email with verification link
    console.log(`Verification link: ${process.env.NEXTAUTH_URL}/auth/email-verify?token=${verificationToken}`);

    // Return user without password
    const { password: _password, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      message: 'User registered successfully. Please check your email for verification.',
      user: userWithoutPassword,
      verificationToken
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}