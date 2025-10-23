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

    // 🔹 Gunakan prefix v1 agar ke proxy baru
    const res = await fetch("/api/v1/auth/protected", {
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

    // 🔹 Pastikan role bisa diambil dari beberapa kemungkinan struktur
    const role =
      data?.data?.role ||
      data?.role ||
      data?.user?.role ||
      localStorage.getItem("role") ||
      "unknown";

    // 🔹 Kembalikan hasil validasi
    return {
      success: true,
      role,
      data,
    };
  } catch (error) {
    console.error("❌ Auth check failed:", error);
    return { success: false, message: "Auth check failed" };
  }
}
