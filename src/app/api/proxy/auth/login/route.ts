import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { identifier, password } = body

    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'Email/Username dan Password wajib diisi.' },
        { status: 400 }
      )
    }

    // ✅ Tentukan apakah pakai email atau username
    const payload = identifier.includes('@')
      ? { email: identifier, password }
      : { username: identifier, password }

    const response = await fetch('https://puspa.sinus.ac.id/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: 'External API error', details: data },
        { status: response.status }
      )
    }

    // ✅ Simpan token + role di cookie
    const nextResponse = NextResponse.json(data, { status: 200 })
    nextResponse.cookies.set('token', data.data?.token || '', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
    })
    nextResponse.cookies.set('role', data.data?.role || '', {
      path: '/',
    })

    return nextResponse
  } catch (error) {
    console.error('Proxy login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
