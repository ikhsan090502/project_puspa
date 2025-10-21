import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("📡 Proxying login request ke API eksternal...");

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
      console.error("❌ Login gagal dari API eksternal:", data);
      return NextResponse.json(
        { success: false, message: data.message || "Login gagal. Cek kembali username/password Anda." },
        { status: response.status }
      );
    }

    // ✅ Simpan cookie token dan role
    const res = NextResponse.json({
      success: true,
      message: "Login berhasil",
      data: data.data,
    });

    if (data?.data?.token) {
      res.cookies.set("token", data.data.token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: 60 * 60 * 4, // 4 jam
      });
    }

    if (data?.data?.role) {
      res.cookies.set("role", data.data.role, {
        httpOnly: false,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: 60 * 60 * 4,
      });
    }

    console.log("✅ Cookie token & role berhasil diset.");
    return res;
  } catch (error) {
    console.error("🔥 Proxy login error:", error);
    return NextResponse.json(
      { success: false, message: "Kesalahan server internal." },
      { status: 500 }
    );
  }
}
