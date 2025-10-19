import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api/proxy",
});

// Request interceptor to add auth token from cookies and log requests
axiosInstance.interceptors.request.use((config) => {
  const fullURL = `${config.baseURL}${config.url}`;

  console.log("🚀 Axios Request:", {
    method: config.method?.toUpperCase(),
    url: config.url,
    baseURL: config.baseURL,
    fullURL: fullURL,
    headers: {
      ...config.headers,
      // Don't log full Authorization header for security
      ...(config.headers.Authorization && typeof config.headers.Authorization === 'string' && {
        Authorization: `${config.headers.Authorization.substring(0, 20)}...`
      })
    }
  });

  if (typeof window !== "undefined") {
    // Get token from cookie (we'll need to read it from document.cookie)
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));

    if (tokenCookie) {
      const token = tokenCookie.split('=')[1];
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  }
  return config;
});

// Response interceptor to handle token refresh or logout on 401 and log responses
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
      data: error.response?.data
    });

    if (error.response?.status === 401) {
      // Clear cookies and redirect to login
      if (typeof window !== "undefined") {
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

        // Redirect to login page
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
