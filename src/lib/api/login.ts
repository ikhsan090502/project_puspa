import axiosInstance from "../axios";

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

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  try {
    const endpoint = "/auth/login";
    console.log("🔄 Login API Call:", {
      endpoint,
      method: "POST",
      baseURL: axiosInstance.defaults.baseURL,
      fullURL: `${axiosInstance.defaults.baseURL}${endpoint}`,
      payload: { identifier: payload.identifier, password: "****" } // Hide password in logs
    });

    const res = await axiosInstance.post(endpoint, payload);

    if (!res.data?.success) {
      throw res.data;
    }

    const { token, tokenType, role } = res.data.data;

    console.log("✅ Login API Success:", {
      endpoint,
      status: res.status,
      role: role,
      hasToken: !!token
    });

    // Store in sessionStorage for client-side access (cookies are HTTP-only)
    if (typeof window !== "undefined") {
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("tokenType", tokenType);
      sessionStorage.setItem("role", role);
    }

    return { token, tokenType, role };
  } catch (err: any) {
    console.error("❌ Login API Error:", {
      endpoint: "/auth/login",
      error: err.message,
      status: err.response?.status,
      data: err.response?.data
    });

    if (err.response?.status === 401) {
      throw { general: "Username atau password salah." };
    }

    if (err.errors) {
      throw err.errors;
    }

    throw { general: err.response?.data?.message || err.message || "Terjadi kesalahan login." };
  }
};
