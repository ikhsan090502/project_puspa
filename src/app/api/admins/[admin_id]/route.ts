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

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ admin_id: string }> }
) {
  try {
    const adminUser = verifyAdminToken(request);
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { admin_id } = await context.params;
    const admin = admins.find(a => a.id === parseInt(admin_id));

    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      );
    }

    // Return admin without password
    const { password: _, ...adminWithoutPassword } = admin;

    return NextResponse.json({
      admin: adminWithoutPassword
    });

  } catch (error) {
    console.error('Get admin error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ admin_id: string }> }
) {
  try {
    const adminUser = verifyAdminToken(request);
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { admin_id } = await context.params;
    const updateData = await request.json();

    // Find admin
    const adminIndex = admins.findIndex(a => a.id === parseInt(admin_id));
    if (adminIndex === -1) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      );
    }

    // Check if this is a PUT request (update)
    if (updateData._method === 'PUT') {
      const { _method: _putMethod, ...updateFields } = updateData;

      // Validate fields that can be updated
      const allowedFields = ['email', 'username', 'admin_name', 'admin_phone'];
      const filteredFields: { email?: string; username?: string; admin_name?: string; admin_phone?: string } = {};

      allowedFields.forEach(field => {
        if (field === 'email' && updateFields[field] !== undefined) {
          filteredFields.email = updateFields[field];
        } else if (field === 'username' && updateFields[field] !== undefined) {
          filteredFields.username = updateFields[field];
        } else if (field === 'admin_name' && updateFields[field] !== undefined) {
          filteredFields.admin_name = updateFields[field];
        } else if (field === 'admin_phone' && updateFields[field] !== undefined) {
          filteredFields.admin_phone = updateFields[field];
        }
      });

      // Check if email/username already exists (if being updated)
      if (filteredFields.email || filteredFields.username) {
        const existingAdmin = admins.find(
          (admin: Admin) => admin.id !== parseInt(admin_id) &&
          (admin.email === filteredFields.email || admin.username === filteredFields.username)
        );
        if (existingAdmin) {
          return NextResponse.json(
            { error: 'Admin with this email or username already exists' },
            { status: 409 }
          );
        }
      }

      // Update admin
      admins[adminIndex] = { ...admins[adminIndex], ...filteredFields };

      // Also update in users array
      const userIndex = users.findIndex(u => u.id === parseInt(admin_id));
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...filteredFields };
      }

      // Return updated admin without password
      const { password: _password, ...adminWithoutPassword } = admins[adminIndex];

      return NextResponse.json({
        message: 'Admin updated successfully',
        admin: adminWithoutPassword
      });
    }

    return NextResponse.json(
      { error: 'Invalid method' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Update admin error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ admin_id: string }> }
) {
  try {
    const adminUser = verifyAdminToken(request);
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { admin_id } = await context.params;

    // Find admin
    const adminIndex = admins.findIndex(a => a.id === parseInt(admin_id));
    if (adminIndex === -1) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      );
    }

    // Remove admin from both arrays
    admins.splice(adminIndex, 1);
    const userIndex = users.findIndex(u => u.id === parseInt(admin_id));
    if (userIndex !== -1) {
      users.splice(userIndex, 1);
    }

    return NextResponse.json({
      message: 'Admin deleted successfully'
    });

  } catch (error) {
    console.error('Delete admin error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}