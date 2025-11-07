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
  baseURL: "/api/proxy", // ✅ selalu pakai proxy ke API Laravel
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // penting supaya cookie dari Next API bisa diterima browser
});

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const endpoint = "/auth/login";
  console.log("🔄 Login API Call:", {
    endpoint,
    method: "POST",
    baseURL: axiosInstance.defaults.baseURL,
    fullURL: `${axiosInstance.defaults.baseURL}${endpoint}`,
    payload: { identifier: payload.identifier, password: "****" },
  });

  try {
    const res = await axiosInstance.post(endpoint, payload);

    if (!res.data?.success) {
      throw res.data;
    }

    const { token, tokenType, role } = res.data.data;

    console.log("✅ Login API Success:", {
      endpoint,
      status: res.status,
      role,
      hasToken: !!token,
    });

    // Simpan sementara di sessionStorage untuk client-side navigasi
    if (typeof window !== "undefined") {
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("tokenType", tokenType);
      sessionStorage.setItem("role", role);
    }

    return { token, tokenType, role };
  } catch (err: any) {
    console.error("❌ Login API Error:", {
      endpoint,
      error: err.message,
      status: err.response?.status,
      data: err.response?.data,
    });

    const resData = err.response?.data;

    if (err.response?.status === 401) {
      throw { general: "Username atau password salah." };
    }

    if (resData?.errors) {
      throw resData.errors;
    }

    throw {
      general:
        resData?.message || err.message || "Terjadi kesalahan saat login.",
    };
  }
};
