"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useLogin, LoginPayload } from "@/lib/api/login";

export default function LoginPage() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldError, setFieldError] = useState<{ general?: string }>({});

  const loginMutation = useLogin();

  const isFilled = identifier.trim() !== "" && password.trim() !== "";

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldError({});

    const payload: LoginPayload = { identifier, password };

    loginMutation.mutate(payload, {
      onSuccess: () => {
        router.push("/terapis/observasi"); 
      },
      onError: (error) => {
        if (error instanceof Error) {
          setFieldError({ general: error.message });
        } else {
          setFieldError({ general: "Terjadi kesalahan saat login." });
        }
      },
    });
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
          <h2 className="text-xl font-extrabold text-left text-[#36315B] mb-2">
            Selamat Datang Kembali di Puspa
          </h2>
          <p className="text-left text-sm text-[#36315B] mb-6">
            Kami sangat senang bisa menjadi bagian dari perjalanan tumbuh kembang anak Anda.
          </p>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#36315B] mb-2">
                Username atau Email
              </label>
              <input
                type="text"
                placeholder="Enter username or email address"
                className="w-full h-[50px] rounded-lg px-3 py-2 border border-[#ADADAD] bg-white outline-none focus:ring-2 focus:ring-[#81B7A9]"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-[#36315B] mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  className="w-full h-[50px] rounded-lg px-3 pr-12 py-2 border border-[#ADADAD] bg-white outline-none focus:ring-2 focus:ring-[#81B7A9]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                </button>
              </div>
            </div>

            {fieldError.general && (
              <p className="text-[#AD3113] text-sm mb-3 text-left">{fieldError.general}</p>
            )}

            <div className="text-right w-full mb-4">
              <Link href="/auth/lupa_password" className="text-[13px] text-[#AD3113] underline">
                Lupa Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending || !isFilled}
              className={`w-full h-[50px] mb-4 rounded-lg font-medium text-white shadow-md transition-colors duration-300 flex items-center justify-center ${
                isFilled ? "bg-[#81B7A9] hover:bg-[#6EA092]" : "bg-[#C0DCD6] cursor-not-allowed"
              }`}
            >
              {loginMutation.isPending ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "LOGIN"
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-[#8D8D8D] text-[15px] mb-1">Belum Punya Akun?</p>
            <p className="text-[#EDB720] text-[16px] font-semibold">
              <Link href="/auth/register">Daftar disini!</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
