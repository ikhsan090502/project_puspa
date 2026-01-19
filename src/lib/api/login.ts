import axiosInstance from "@/lib/axios";

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  user_id: string;
  username: string;
  email: string;
  token: string;
  tokenType: string;
  role: string;
}

export interface LoginErrorResponse {
  identifier?: string[];
  password?: string[];
  general?: string;
}

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  try {
    const res = await axiosInstance.post("/auth/login", payload);

    if (!res.data?.success) {
      throw res.data;
    }

    const { user_id, username, email, token, tokenType, role } = res.data.data;

    // Simpan ke localStorage agar bisa digunakan di halaman lain
    localStorage.setItem("token", token);
    localStorage.setItem("tokenType", tokenType);
    localStorage.setItem("role", role);
    localStorage.setItem("username", username);
    localStorage.setItem("email", email);
    localStorage.setItem("user_id", user_id);

    return { user_id, username, email, token, tokenType, role };
  } catch (err: any) {
    const backendMessage = err.response?.data?.message || err.message;

    if (err.response?.status === 401) {
      // Jika backend memberikan pesan spesifik (misal: "Email belum diverifikasi"), tampilkan itu.
      // Jika tidak, baru tampilkan "Username atau password salah".
      throw { general: backendMessage || "Username atau password salah." };
    }

    if (err.errors) {
      throw err.errors;
    }

    throw { general: backendMessage || "Terjadi kesalahan login." };
  }
};
