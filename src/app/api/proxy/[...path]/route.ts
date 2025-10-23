import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://puspa.sinus.ac.id/api/v1";

export async function GET(req: NextRequest, { params }: any) {
  const url = `${API_BASE}/${params.path.join("/")}${req.nextUrl.search || ""}`;

  // ✅ Ambil token langsung dari cookies
  const token = req.cookies.get("token")?.value;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
    });

    const text = await res.text();

    return new NextResponse(text, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (err) {
    console.error("Proxy GET error:", err);
    return NextResponse.json(
      { success: false, message: "Proxy failed" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest, { params }: any) {
  const url = `${API_BASE}/${params.path.join("/")}`;
  const token = req.cookies.get("token")?.value;
  const body = await req.text();

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
      body,
    });

    const text = await res.text();

    return new NextResponse(text, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (err) {
    console.error("Proxy POST error:", err);
    return NextResponse.json(
      { success: false, message: "Proxy failed" },
      { status: 500 }
    );
  }
}
