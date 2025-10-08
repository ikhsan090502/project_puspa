import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://puspa.sinus.ac.id/api/v1", 
});

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    const tokenType = localStorage.getItem("tokenType") || "Bearer";
    if (token) {
      config.headers.Authorization = `${tokenType} ${token}`;
    }
  }
  return config;
});

export default axiosInstance;
