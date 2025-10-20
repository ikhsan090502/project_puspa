export async function checkAuth(): Promise<{
  success: boolean;
  role?: string;
  message?: string;
}> {
  try {
    const res = await fetch("/api/proxy/auth/protected", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok || !data?.success) {
      return { success: false, message: "Unauthorized" };
    }

    return { success: true, role: data?.data?.role };
  } catch (err) {
    console.error("❌ Auth check error:", err);
    return { success: false, message: "Server error" };
  }
}