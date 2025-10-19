
import axiosInstance from "../axios";
import axios from "axios";

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  data?: any;
}

export async function forgotPassword(
  { email }: ForgotPasswordPayload
): Promise<ForgotPasswordResponse> {
  try {
    const response = await axiosInstance.post("/auth/forgot-password", { email });

    return {
      success: true,
      message: response.data?.message || "Permintaan reset password berhasil.",
      data: response.data,
    };
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const data = err.response?.data;

      console.error("❌ Axios error:", status, data);

      if (status === 422) {
        const errors = data?.errors;
        const firstError = errors?.email?.[0] || "Email tidak valid";
        throw new Error(firstError);
      }

      if (status === 404) {
        throw new Error("Email tidak ditemukan.");
      }

      throw new Error(data?.message || "Gagal mengirim email.");
    } else if (err instanceof Error) {
      throw new Error(err.message);
    } else {
      throw new Error("Gagal menghubungi server.");
    }
  }
}
