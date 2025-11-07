import axiosInstance from "@/lib/axios";

export async function logout() {
  try {
    console.log("🚪 Logging out...");

    // Panggil langsung /api/auth/logout (BUKAN /api/proxy)
    await axiosInstance.post("/../auth/logout");

    // Hapus cookie di browser
    ["token", "role"].forEach((name) => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });

    // Bersihkan localStorage juga
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    console.log("✅ Logout berhasil, redirect ke login...");
    window.location.href = "/auth/login";
  } catch (err) {
    console.error("❌ Logout gagal:", err);
    alert("Logout gagal: " + (err as any)?.message);
  }
}
