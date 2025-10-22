import { NextRequest, NextResponse } from "next/server";

// src/lib/checkAuth.ts
export async function checkAuth() {
  try {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      console.warn("❌ No token found in cookie");
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
      console.warn("🚫 Unauthorized:", res.status);
      return { success: false, message: "Unauthorized" };
    }

    const data = await res.json();
    console.log("✅ Auth success:", data);

    return { success: true, data };
  } catch (error) {
    console.error("❌ Auth check failed:", error);
    return { success: false, message: "Auth check failed" };
  }
}
