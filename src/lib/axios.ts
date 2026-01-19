// lib/axios.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptor untuk inject token dari localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    // 🔹 Jangan kirim Authorization jika ke endpoint auth / register
    const isAuthPath =
      config.url?.includes("/auth/login") ||
      config.url?.includes("/auth/register") ||
      config.url?.includes("/auth/forgot-password") ||
      config.url?.includes("/auth/reset-password");

    if (typeof window !== "undefined" && !isAuthPath) {
      const token = localStorage.getItem("token");
      const tokenType = localStorage.getItem("tokenType") || "Bearer";

      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `${tokenType} ${token}`;
        console.log("[Axios] Inject token:", config.headers.Authorization);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
