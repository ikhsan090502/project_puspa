import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Token tidak ditemukan" },
      { status: 401 }
    );
  }

  try {
    const res = await fetch("https://puspa.sinus.ac.id/api/v1/auth/protected", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ success: true, data: data.data });
  } catch (err) {
    console.error("🔥 Error protected:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
