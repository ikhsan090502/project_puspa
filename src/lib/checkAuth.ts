import { NextRequest, NextResponse } from "next/server";

// src/lib/checkAuth.ts
export async function checkAuth(): Promise<{
  success: boolean;
  role?: string;
  message?: string;
}> {
  try {
    console.log("🔍 Checking authentication...");

    const res = await fetch("/api/proxy/auth/protected", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok || !data?.success) {
      console.log("❌ Authentication failed:", data);
      return { success: false, message: "Unauthorized" };
    }

    console.log("✅ Authentication successful:", { role: data?.data?.role });
    return { success: true, role: data?.data?.role };
  } catch (err) {
    console.error("❌ Auth check error:", err);
    return { success: false, message: "Server error" };
  }
}

// Server-side authentication check (optional)
export async function checkAuthServer(token?: string) {
  try {
    const res = await fetch("https://puspa.sinus.ac.id/api/v1/auth/protected", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok || !data?.success) {
      return { success: false, message: "Unauthorized" };
    }

    return { success: true, role: data.data?.role };
  } catch (error) {
    console.error("❌ checkAuthServer error:", error);
    return { success: false, message: "Server Error" };
  }
}
