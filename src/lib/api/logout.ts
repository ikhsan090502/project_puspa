export async function logout() {
  try {
    const res = await fetch("/api/auth/logout", { method: "POST" });
    const data = await res.json();
    console.log("🚪 Logout berhasil:", data);

    // Hapus juga sisa token/role di localStorage (jaga-jaga)
    localStorage.removeItem("role");
    localStorage.removeItem("token");

    return true;
  } catch (error) {
    console.error("❌ Logout gagal:", error);
    return false;
  }
}
