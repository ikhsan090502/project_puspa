export const runtime = 'nodejs'

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('🔄 Proxy Login Request:', {
      endpoint: 'https://puspa.sinus.ac.id/api/v1/auth/login',
      method: 'POST',
      body: { identifier: body.identifier, password: '****' }
    });

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const response = await fetch("https://puspa.sinus.ac.id/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "User-Agent": "Next.js Proxy (Vercel)",
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle non-JSON responses (like HTML error pages)
      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error('❌ Non-JSON response from external API:', {
          status: response.status,
          contentType,
          body: text.substring(0, 200)
        });
        return NextResponse.json(
          {
            success: false,
            error: 'External API returned invalid response',
            details: 'Expected JSON but received HTML/text'
          },
          { status: 502 }
        );
      }

      if (!response.ok) {
        console.error('❌ External API Error:', {
          status: response.status,
          data
        });
        return NextResponse.json(
          {
            success: false,
            error: 'External API error',
            details: data,
            status: response.status
          },
          { status: response.status }
        );
      }

      console.log('✅ Proxy Login Success:', {
        status: response.status,
        role: data?.data?.role
      });

      // ✅ Simpan cookie token & role untuk middleware
      const res = NextResponse.json({
        success: true,
        data: data.data,
        message: 'Login successful'
      }, { status: 200 });

      if (data?.data?.token) {
        res.cookies.set('token', data.data.token, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60, // 7 days
          path: '/',
        });
      }
      if (data?.data?.role) {
        res.cookies.set('role', data.data.role, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60, // 7 days
          path: '/',
        });
      }

      return res;
    } catch (fetchError: any) {
      clearTimeout(timeoutId);

      if (fetchError.name === 'AbortError') {
        console.error('❌ Request timeout to external API');
        return NextResponse.json(
          {
            success: false,
            error: 'Request timeout',
            message: 'External API took too long to respond'
          },
          { status: 504 }
        );
      }

      throw fetchError;
    }
  } catch (error) {
    console.error('❌ Proxy login error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle preflight requests
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
