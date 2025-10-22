export async function checkAuth() {
  try {
    // 🔍 Ambil token dari cookie
    let token =
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1] || "";

    // 🔄 Jika cookie kosong, fallback ke localStorage
    if (!token && typeof window !== "undefined") {
      token = localStorage.getItem("token") || "";
    }

    if (!token) {
      console.warn("❌ No token found");
      return { success: false, message: "No token" };
    }

    const res = await fetch("/api/auth/protected", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
