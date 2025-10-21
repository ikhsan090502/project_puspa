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
      if (token && token !== 'undefined' && token !== 'null' && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  }

  const fullURL = config.baseURL ? `${config.baseURL}${config.url}` : config.url;

  console.log("🚀 Axios Request:", {
    method: config.method?.toUpperCase(),
    url: config.url,
    baseURL: config.baseURL,
    fullURL: fullURL,
    timeout: config.timeout,
    headers: {
      ...config.headers,
      // Don't log full Authorization header for security
      ...(config.headers.Authorization && typeof config.headers.Authorization === 'string' && {
        Authorization: `${config.headers.Authorization.substring(0, 20)}...`
      })
    }
  });

  return config;
});

// 🧠 Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("✅ Axios Response:", {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error("❌ Axios Error:", {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      code: error.code,
      data: error.response?.data
    });

    if (error.response?.status === 401 && typeof window !== "undefined") {
      // Clear all auth cookies
      const cookiesToClear = ['token', 'role', 'userId'];
      cookiesToClear.forEach(cookieName => {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      });

      window.location.href = "/auth/login";
    }

    // Handle timeout errors specifically
    if (error.code === 'ECONNABORTED') {
      console.error('❌ Request timeout - external API not responding');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
