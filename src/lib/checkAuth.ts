// src/lib/checkAuth.ts
export async function checkAuth() {
  try {
    console.log("🔍 Checking authentication...");

    // 🔹 Ambil token dari cookie atau localStorage
    let token =
      (typeof document !== "undefined" &&
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1]) ||
      (typeof window !== "undefined" && localStorage.getItem("token"));

    if (!token) {
      console.warn("❌ No token found");
      return { success: false, message: "No token" };
    }

    token = decodeURIComponent(token);

    // 🔹 Panggil endpoint proteksi
    const res = await fetch("/api/proxy/auth/protected", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
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

    // Tambahkan role jika dikirim dari backend
    return {
      success: true,
      role: data?.data?.role || localStorage.getItem("role") || "unknown",
      data,
    };
  } catch (error) {
    console.error("❌ Auth check failed:", error);
    return { success: false, message: "Auth check failed" };
  }
}
