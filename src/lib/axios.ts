import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api/proxy", // ✅ Gunakan proxy bawaan Next.js
  withCredentials: true, // ✅ biar cookie (token, role) ikut terkirim
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// 🧩 Request interceptor: tambahkan token dari cookie browser
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const cookies = document.cookie.split(";");
    const tokenCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("token=")
    );

    if (tokenCookie) {
      const token = tokenCookie.split("=")[1];
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  }

  console.log("🚀 Axios Request:", {
    method: config.method?.toUpperCase(),
    fullURL: `${config.baseURL}${config.url}`,
    headers: config.headers,
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
      data: error.response?.data,
    });

    if (error.response?.status === 401 && typeof window !== "undefined") {
      // hapus cookie & redirect ke login
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
        "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.href = "/auth/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
