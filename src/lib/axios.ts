import axios from "axios";

const isVercel = typeof window !== "undefined" && window.location.hostname.includes("vercel.app");

// ✅ Gunakan baseURL yang aman di semua environment
const axiosInstance = axios.create({
  baseURL: isVercel ? "" : process.env.NEXT_PUBLIC_API_URL || "/api/proxy",
  withCredentials: true,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// 🔐 Tambah token dari cookie (client-side)
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const cookies = document.cookie.split(";");
    const tokenCookie = cookies.find((cookie) => cookie.trim().startsWith("token="));
    if (tokenCookie) {
      const token = tokenCookie.split("=")[1];
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  }

  console.log("🚀 Axios Request:", {
    method: config.method?.toUpperCase(),
    baseURL: config.baseURL,
    url: config.url,
  });

  return config;
});

// 🧠 Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("✅ Axios Response:", {
      status: response.status,
      url: response.config.url,
    });
    return response;
  },
  (error) => {
    console.error("❌ Axios Error:", {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
    });

    if (error.response?.status === 401 && typeof window !== "undefined") {
      // Clear cookies
      ["token", "role", "userId"].forEach((name) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      });
      window.location.href = "/auth/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
