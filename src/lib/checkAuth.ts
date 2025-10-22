export async function checkAuth() {
  try {
    const res = await fetch("/api/auth/protected", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok || !data?.success) {
      return { success: false, message: "Unauthorized" };
    }

    const role = data?.data?.role || data?.data?.data?.role;
    return { success: true, role, data };
  } catch (error) {
    console.error("❌ checkAuth error:", error);
    return { success: false, message: "Check failed" };
  }
}
