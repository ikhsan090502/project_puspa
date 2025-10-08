import axios from "axios";

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  tokenType: string;
  role: string;
}

export interface LoginErrorResponse {
  identifier?: string[];
  password?: string[];
  general?: string;
}

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

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  try {
    const res = await axiosInstance.post("/auth/login", payload);

    if (!res.data?.success) {
      throw res.data; 
    }

    const { token, tokenType, role } = res.data.data;

    localStorage.setItem("token", token);
    localStorage.setItem("tokenType", tokenType);
    localStorage.setItem("role", role);

    return { token, tokenType, role };
  } catch (err: any) {
    if (err.response?.status === 401) {
      throw { general: "Username atau password salah." };
    }

    if (err.errors) {
      throw err.errors; 
    }

    throw { general: err.response?.data?.message || err.message || "Terjadi kesalahan login." };
  }
};
