import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 🚀 Kirim request ke API eksternal
    const response = await fetch("https://puspa.sinus.ac.id/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    // ❌ Kalau gagal dari server eksternal
    if (!response.ok) {
      console.error("❌ External API Error:", data);
      return NextResponse.json(
        { error: "External API error", details: data },
        { status: response.status }
      );
    }

    // ✅ Berhasil: buat response dan simpan token di cookie
    const res = NextResponse.json(data, { status: 200 });

    const token = data?.data?.token;
    const role = data?.data?.role;

    if (token) {
      res.cookies.set("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
      });
    }

    if (role) {
      res.cookies.set("role", role, {
        httpOnly: false,
        path: "/",
      });
    }

    return res;
  } catch (error) {
    console.error("Proxy login error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// 🔧 OPTIONS untuk preflight CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
