import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Deteksi apakah input email atau username
    const identifier = body.email || body.username || body.identifier;
    const password = body.password;

    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'Email/Username dan Password wajib diisi.' },
        { status: 400 }
      );
    }

    // Tentukan field mana yang akan dikirim ke backend
    const payload = identifier.includes('@')
      ? { email: identifier, password }
      : { username: identifier, password };

    // Forward ke API eksternal
    const response = await fetch('https://puspa.sinus.ac.id/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
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

    // Simpan token dan role ke cookie
    const nextResponse = NextResponse.json(data, { status: response.status });

    if (data?.data?.token) {
      nextResponse.cookies.set('token', data.data.token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
      });
    }

    if (data?.data?.role) {
      nextResponse.cookies.set('role', data.data.role, {
        path: '/',
      });
    }

    // CORS
    nextResponse.headers.set('Access-Control-Allow-Origin', request.headers.get('origin') || '*');
    nextResponse.headers.set('Access-Control-Allow-Credentials', 'true');
    nextResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    nextResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return nextResponse;
  } catch (error) {
    console.error('Proxy login error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: (error as Error).message },
      { status: 500 }
    );
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
