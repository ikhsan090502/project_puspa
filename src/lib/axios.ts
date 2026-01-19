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
    if (typeof window !== "undefined") {
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
