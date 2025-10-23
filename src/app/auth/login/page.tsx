"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("🔄 Login API Call:", { endpoint: "/auth/login" });

      // 🚀 Panggil API login via proxy
      const response = await axiosInstance.post("/auth/login", {
        identifier,
        password,
      });

      console.log("✅ Login API Success:", response.data);

      const { token, role } = response.data?.data || {};

      if (token) {
        // 🧁 Simpan token ke cookie agar bisa dibaca di halaman lain
        document.cookie = `token=${encodeURIComponent(
          token
        )}; path=/; max-age=86400; SameSite=Lax`;

        // 🔐 Simpan juga ke localStorage sebagai backup
        localStorage.setItem("token", token);
        localStorage.setItem("role", role || "");

        console.log("🍪 Token disimpan di cookie:", token);

        // ⏳ Tunggu sejenak agar cookie tersimpan sepenuhnya
        await new Promise((r) => setTimeout(r, 700));

        // 🔀 Arahkan sesuai role
        if (role === "admin") router.push("/admin/dashboard");
        else if (role === "terapis") router.push("/terapis/dashboard");
        else if (role === "orangtua") router.push("/orangtua/dashboard");
        else router.push("/");
      } else {
        alert("Login gagal: token tidak diterima dari server");
      }
    } catch (err: any) {
      console.error("❌ Login error:", err.response?.data || err.message);
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Login gagal. Username atau password salah.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="layout-main min-h-screen bg-[#B8E8DB] flex flex-col">
      <header className="w-full flex justify-start p-4">
        <Image src="/logo.png" alt="Logo Puspa" width={160} height={50} priority />
      </header>

      <div className="flex flex-1 justify-center items-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-white rounded-2xl p-8 shadow-[0_4px_20px_#ADADAD]"
        >
          <h2 className="text-xl font-extrabold text-[#36315B] mb-2">
            Selamat Datang di Puspa
          </h2>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#36315B] mb-2">
                Username atau Email
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full h-[50px] rounded-lg px-3 py-2 border border-[#ADADAD]"
                required
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-[#36315B] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-[50px] rounded-lg px-3 pr-10 border border-[#ADADAD]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[50px] mt-4 rounded-lg bg-[#81B7A9] text-white font-medium"
            >
              {loading ? "Memproses..." : "LOGIN"}
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-[#8D8D8D] text-[15px] mb-1">Belum punya akun?</p>
            <p className="text-[#EDB720] text-[16px] font-semibold">
              <Link href="/auth/register">Daftar di sini!</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
