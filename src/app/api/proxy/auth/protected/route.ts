import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "No token" }, { status: 401 });
    }

    const res = await fetch("https://puspa.sinus.ac.id/api/v1/auth/protected", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Error fetching protected route:", error);
    return NextResponse.json({ success: false, message: "Internal Error" }, { status: 500 });
  }
}