import axios from "axios";
import { useMutation, UseMutationResult } from "@tanstack/react-query";

// -------------------
// Types
// -------------------
export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    username: string;
    email?: string;
    role: string;
    tokenType: string;      
    accessToken: string;
    refreshToken?: string;
    createdAt?: string;
    updatedAt?: string;
  };
}

// -------------------
// Axios instance
// -------------------
export const authAxios = axios.create({
  baseURL: "https://50f0aeb59dfd.ngrok-free.app/api/v1",
});

// Interceptor untuk menambahkan token otomatis
authAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = token; 
  }
  return config;
});

// -------------------
// Login function
// -------------------
export async function loginUser({ identifier, password }: LoginPayload): Promise<string> {
  try {
    const res = await axios.post<LoginResponse>(
      "https://50f0aeb59dfd.ngrok-free.app/api/v1/auth/login",
      { identifier, password },
      { headers: { "Content-Type": "application/json" } }
    );

    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Login gagal.");
    }

    const token = `${res.data.data.tokenType} ${res.data.data.accessToken}`;
    localStorage.setItem("token", token); 
    return token;

  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const message = err.response?.data?.message || "";

      // 401 Unauthorized → Username / Password salah
      if (status === 401) {
        throw new Error("Username atau Password salah. Coba lagi!");
      }

      // Akun belum aktif
      if (message.toLowerCase().includes("belum aktif")) {
        throw new Error("Akun belum aktif. Silakan melakukan verifikasi!");
      }

      throw new Error(message || "Gagal menghubungi server.");
    }

    if (err instanceof Error) {
      throw new Error(err.message);
    }

    throw new Error("Terjadi kesalahan saat login.");
  }
}

// -------------------
// React hook: useLogin
// -------------------
export function useLogin(): UseMutationResult<string, Error, LoginPayload> {
  return useMutation({
    mutationFn: loginUser,
  });
}
