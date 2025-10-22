import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "No token" }, { status: 401 });
    }

    const res = await fetch("https://puspa.sinus.ac.id/api/v1/auth/protected", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${decodeURIComponent(token)}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Proxy auth error:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
