import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token tidak ditemukan" },
        { status: 401 }
      );
    }

    console.log("🔑 Memeriksa token ke API eksternal...");

    const response = await fetch("https://puspa.sinus.ac.id/api/v1/auth/protected", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${decodeURIComponent(token)}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Token invalid di API eksternal:", data);
      return NextResponse.json(
        { success: false, message: data.message || "Unauthorized" },
        { status: response.status }
      );
    }

    // ✅ Kembalikan data lengkap termasuk role
    console.log("✅ Token valid, role:", data?.data?.role);

    return NextResponse.json({
      success: true,
      data: {
        role: data?.data?.role || "unknown",
        user: data?.data?.user || null,
      },
    });
  } catch (error) {
    console.error("🔥 Protected route error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
