import { NextRequest, NextResponse } from "next/server";

// src/lib/checkAuth.ts
// src/lib/authService.ts
export async function login(email: string, password: string) {
  const res = await fetch("https://puspa.sinus.ac.id/api/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login gagal");

  // Setelah login berhasil, simpan token ke cookie
  if (data.data?.token) {
    document.cookie = `token=${encodeURIComponent(
      data.data.token
    )}; path=/; max-age=86400; SameSite=Lax; Secure`;
  }

  if (data.data?.role) {
    document.cookie = `role=${data.data.role}; path=/; max-age=86400; SameSite=Lax; Secure`;
  }

  console.log("✅ Token disimpan di cookie:", data.data.token);
  return data;
}
