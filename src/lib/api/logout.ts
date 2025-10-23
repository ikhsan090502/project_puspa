import axiosInstance from "@/lib/axios";

export async function logout() {
  try {
    await axiosInstance.post("/auth/logout");
    ["token", "role"].forEach((name) => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
    localStorage.clear();
    window.location.href = "/auth/login";
  } catch (error) {
    console.error("Logout gagal:", error);
  }
}
