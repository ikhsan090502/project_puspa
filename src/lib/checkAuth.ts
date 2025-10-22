import { NextRequest, NextResponse } from "next/server";

// src/lib/checkAuth.ts
export async function checkAuth() {
  try {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return { success: false, message: "No token" };
    }

    const res = await fetch("https://puspa.sinus.ac.id/api/v1/auth/protected", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${decodeURIComponent(token)}`,
        Accept: "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      return { success: false, message: "Unauthorized" };
    }

    const data = await res.json();
    console.log("✅ Auth success:", data);

    // ambil role langsung dari data
    const role = data?.role || data?.data?.role;

    return { success: true, role, data };
  } catch (error) {
    console.error("❌ Auth check failed:", error);
    return { success: false, message: "Auth check failed" };
  }
}
