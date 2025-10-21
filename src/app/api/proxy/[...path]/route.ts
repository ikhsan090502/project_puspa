export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS';

// --- Forward semua method ---
export async function GET(req: NextRequest, ctx: any) { return proxy(req, 'GET', ctx.params.path); }
export async function POST(req: NextRequest, ctx: any) { return proxy(req, 'POST', ctx.params.path); }
export async function PUT(req: NextRequest, ctx: any) { return proxy(req, 'PUT', ctx.params.path); }
export async function DELETE(req: NextRequest, ctx: any) { return proxy(req, 'DELETE', ctx.params.path); }
export async function PATCH(req: NextRequest, ctx: any) { return proxy(req, 'PATCH', ctx.params.path); }

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// --- Proxy handler utama ---
async function proxy(request: NextRequest, method: HttpMethod, pathSegments: string[]) {
  const path = pathSegments.join('/');
  const targetUrl = `https://puspa.sinus.ac.id/api/v1/${path}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const token = request.cookies.get('token')?.value;
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const body = ['POST', 'PUT', 'PATCH'].includes(method) ? await request.text() : undefined;

  const res = await fetch(targetUrl, { method, headers, body });
  const data = await res.json().catch(() => ({}));

  // 🧠 Jika ini endpoint login → simpan cookie di domain frontend
  if (path.includes('auth/login') && data?.data?.token) {
    const nextRes = NextResponse.json(data, { status: res.status });

    nextRes.cookies.set('token', data.data.token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
    });

    if (data.data.role) {
      nextRes.cookies.set('role', data.data.role, { path: '/' });
    }

    console.log('✅ Proxy login success – cookies stored');
    return nextRes;
  }

  return NextResponse.json(data, { status: res.status });
}
