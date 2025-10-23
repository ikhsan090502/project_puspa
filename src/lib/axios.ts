import axios from "axios";

// Semua request lewat proxy agar token/cookie bisa ikut otomatis
const axiosInstance = axios.create({
  baseURL: "/api/proxy",
  withCredentials: true, // biar cookie dikirim otomatis
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Tambahkan token dari cookie (client-side)
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const cookies = document.cookie.split(";").map((c) => c.trim());
    const tokenPair = cookies.find((c) => c.startsWith("token="));
    if (tokenPair) {
      const token = tokenPair.split("=")[1];
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  }
  return config;
});

// Tangani error respon
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Jika 401, hapus cookie dan redirect ke login
    if (error.response?.status === 401 && typeof window !== "undefined") {
      // Hapus semua cookie yang berkaitan dengan auth
      const authCookies = ["token", "role", "userId"];
      authCookies.forEach((name) => {
        document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax;`;
      });

      console.warn("⚠️ Token invalid atau expired, redirect ke login...");
      window.location.replace("/auth/login"); // gunakan replace agar tidak bisa kembali ke halaman sebelumnya
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
