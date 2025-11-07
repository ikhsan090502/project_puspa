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

const users: User[] = [];
const admins: Admin[] = [];

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
      admins: admins
    });

  } catch (error) {
    console.error('Get admins error:', error);
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

    const { username, email, password, admin_name, admin_phone } = await request.json();

    // Validation
    if (!username || !email || !password || !admin_name) {
      return NextResponse.json(
        { error: 'Username, email, password, and admin name are required' },
        { status: 400 }
      );
    }

    // Check if admin already exists
    const existingAdmin = admins.find(admin => admin.email === email || admin.username === username);
    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Admin with this email or username already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new admin
    const newAdmin = {
      id: admins.length + 1,
      username,
      email,
      password: hashedPassword,
      admin_name,
      admin_phone,
      role: 'admin',
      emailVerified: false,
      createdAt: new Date()
    };

    admins.push(newAdmin);

    // Also add to users array for authentication
    users.push({
      id: newAdmin.id,
      email: newAdmin.email,
      username: newAdmin.username,
      password: newAdmin.password,
      role: 'admin',
      emailVerified: false,
      createdAt: new Date()
    });

    // Return admin without password
    const { password: _password, ...adminWithoutPassword } = newAdmin;

    return NextResponse.json({
      message: 'Admin created successfully',
      admin: adminWithoutPassword
    });

  } catch (error) {
    console.error('Create admin error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}