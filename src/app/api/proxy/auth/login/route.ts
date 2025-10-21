import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("📡 Proxying login request to external API...");

    const response = await fetch("https://puspa.sinus.ac.id/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ External API Error:", data);
      return NextResponse.json(
        { error: "External API error", details: data },
        { status: response.status }
      );
    }

    // ✅ Simpan token & role ke cookie
    const res = NextResponse.json(data, { status: 200 });

    if (data?.data?.token) {
      res.cookies.set("token", data.data.token, {
        httpOnly: true,
        secure: true,
        sameSite: "none", // ⬅️ WAJIB agar cookie dibaca di Vercel
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 hari
      });
    }

    if (data?.data?.role) {
      res.cookies.set("role", data.data.role, {
        httpOnly: false,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    console.log("✅ Login proxy success - cookies stored.");
    return res;
  } catch (error) {
    console.error("🔥 Proxy login error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ⚙️ Handle CORS preflight (OPTIONS)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
