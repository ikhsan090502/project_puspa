import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      console.warn("⛔ Tidak ada token di cookie");
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Panggil API eksternal dengan token
    const response = await fetch("https://puspa.sinus.ac.id/api/v1/auth/protected", {
      headers: {
        Authorization: `Bearer ${decodeURIComponent(token)}`,
      },
    });

    if (!response.ok) {
      console.error("❌ Token invalid atau expired");
      return NextResponse.json({ success: false, message: "Token invalid" }, { status: 401 });
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: "Token valid",
      data,
    });
  } catch (error) {
    console.error("🔥 Error Protected Route:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
