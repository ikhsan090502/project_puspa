import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("📡 Proxying login request ke API eksternal...");

    // 🔹 Pastikan URL eksternal benar
    const API_URL = "https://puspa.sinus.ac.id/api/v1/auth/login";

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    // 🔹 Jika respons tidak OK (status >= 400)
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Login gagal:", response.status, errorText);
      return NextResponse.json(
        {
          success: false,
          message: "Login gagal: " + (errorText || response.statusText),
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("✅ Login berhasil, respon dari API eksternal:", data);

    // 🔹 Pastikan struktur data valid
    const token = data?.data?.token;
    const role = data?.data?.role;

    if (!token) {
      console.error("❌ Token tidak ditemukan dalam respon API:", data);
      return NextResponse.json(
        { success: false, message: "Token tidak diterima dari server." },
        { status: 500 }
      );
    }

    // 🔹 Buat respons sukses
    const res = NextResponse.json({
      success: true,
      message: "Login berhasil",
      data: data.data,
    });

    // 🔹 Set cookie token (HTTP only)
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 4, // 4 jam
    });

    // 🔹 Set cookie role (boleh diakses client)
    if (role) {
      res.cookies.set("role", role, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 4,
      });
    }

    console.log("🍪 Cookie token & role berhasil diset.");
    return res;
  } catch (error: any) {
  console.error("🔥 Proxy login error:", error);
  return NextResponse.json(
    {
      success: false,
      message:
        "Kesalahan server internal: " +
        (error?.cause?.message || error?.message || "Unknown error"),
    },
    { status: 500 }
  );
}
}
