import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // 🔍 Coba ambil token dari cookie atau header Authorization
    const cookieToken = req.cookies.get("token")?.value;
    const headerToken = req.headers.get("authorization")?.replace("Bearer ", "");

    const token = cookieToken || headerToken;

    if (!token) {
      console.warn("❌ No token found in cookie or header");
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    console.log("✅ Token found, validating...");

    // 🔗 Panggil API backend untuk validasi
    const res = await fetch("https://puspa.sinus.ac.id/api/v1/auth/protected", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.warn("🚫 Token invalid:", res.status);
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const data = await res.json();
    console.log("✅ Valid token:", data);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("❌ Auth check failed:", error);
    return NextResponse.json({ success: false, message: "Internal error" }, { status: 500 });
  }
}
