import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: any) {
  const url = `https://puspa.sinus.ac.id/api/v1/${params.path.join("/")}`;
  const token = req.headers.get("authorization");

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: token || "",
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Proxy GET error:", error);
    return NextResponse.json({ success: false, message: "Proxy failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: any) {
  const url = `https://puspa.sinus.ac.id/api/v1/${params.path.join("/")}`;
  const token = req.headers.get("authorization");
  const body = await req.text();

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: token || "",
        "Content-Type": "application/json",
      },
      body,
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Proxy POST error:", error);
    return NextResponse.json({ success: false, message: "Proxy failed" }, { status: 500 });
  }
}
