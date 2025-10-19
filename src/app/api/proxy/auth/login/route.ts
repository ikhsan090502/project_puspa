import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier, email, username, password } = body;

    const userIdentifier = identifier || email || username;

    if (!userIdentifier || !password) {
      return NextResponse.json(
        { error: 'Email/Username dan Password wajib diisi.' },
        { status: 400 }
      );
    }

    // Sesuaikan payload ke API eksternal
    const payload = userIdentifier.includes('@')
      ? { email: userIdentifier, password }
      : { username: userIdentifier, password };

    const response = await fetch('https://puspa.sinus.ac.id/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: 'External API error', details: data },
        { status: response.status }
      );
    }

    // Simpan cookie token + role
    const nextResponse = NextResponse.json(data, { status: 200 });
    nextResponse.cookies.set('token', data.data?.token || '', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
    });
    nextResponse.cookies.set('role', data.data?.role || '', {
      path: '/',
    });

    return nextResponse;

  } catch (error) {
    console.error('Proxy login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
