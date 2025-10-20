import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://puspa.sinus.ac.id/api/v1/auth/protected", {
      headers: { "Accept": "application/json" },
    });
    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Error fetching protected route:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}