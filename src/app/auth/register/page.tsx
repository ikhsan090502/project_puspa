"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const isFilled = email && username && password;

  const validations = [
    { text: "Minimal 8 karakter", valid: password.length >= 8 },
    { text: "Diawali huruf kapital", valid: /^[A-Z]/.test(password) },
    { text: "Terdapat angka", valid: /\d/.test(password) },
    { text: "Terdapat simbol (!@#%&)", valid: /[!@#%&]/.test(password) },
  ];

  const validateEmail = (value: string) => {
    if (!/\S+@\S+\.\S+/.test(value)) {
      setEmailError("Format email tidak valid");
    } else {
      setEmailError(null);
    }
    setEmail(value);
  };

  const validateUsername = (value: string) => {
    if (!value) {
      setUsernameError("Nama pengguna tidak boleh kosong");
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      setUsernameError("Format username tidak valid");
    } else {
      setUsernameError(null);
    }
    setUsername(value);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFilled) return;
    if (emailError || usernameError) return;

    const isPasswordValid = validations.every((rule) => rule.valid);
    if (!isPasswordValid) return;

    setLoading(true);
    setApiError(null);

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });

      const result = await res.json();

      if (res.ok) {
        window.location.href = "/auth/login";
      } else {
        setApiError(result.message || "Pendaftaran gagal");
      }
    } catch (err) {
      setApiError("Terjadi kesalahan server. Coba lagi nanti.");
    }

    setLoading(false);
  };

  return (
    <main className="layout-main min-h-screen bg-[#B8E8DB] flex flex-col">
      <header className="w-full flex justify-start p-4">
        <Image
          src="/logo.png"
          alt="Logo Puspa"
          width={160}
          height={50}
          priority
        />
      </header>

      <div className="flex flex-1 justify-center items-center px-4 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-white rounded-2xl p-8 shadow-[0_4px_20px_#ADADAD]"
        >
          <h2 className="text-xl font-extrabold text-left text-[#36315B] mb-2">
            Selamat Datang di Puspa
          </h2>
          <p className="text-left text-sm text-[#36315B] mb-6">
            Silahkan isi informasi berikut untuk membuat akun.
          </p>

          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#36315B] mb-2">
                Alamat Email
              </label>
              <input
                type="text"
                placeholder="Masukkan Email"
                className={`w-full h-[45px] rounded-lg px-3 py-2 border ${
                  emailError ? "border-red-500" : "border-[#ADADAD]"
                } bg-white outline-none focus:ring-2 focus:ring-[#81B7A9]`}
                value={email}
                onChange={(e) => validateEmail(e.target.value)}
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#36315B] mb-2">
                Nama Pengguna
              </label>
              <input
                type="text"
                placeholder="Masukkan username"
                className={`w-full h-[45px] rounded-lg px-3 py-2 border ${
                  usernameError ? "border-red-500" : "border-[#ADADAD]"
                } bg-white outline-none focus:ring-2 focus:ring-[#81B7A9]`}
                value={username}
                onChange={(e) => validateUsername(e.target.value)}
              />
              {usernameError && (
                <p className="text-red-500 text-sm mt-1">{usernameError}</p>
              )}
            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium text-[#36315B] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  className="w-full h-[45px] rounded-lg px-3 pr-10 py-2 border border-[#ADADAD] bg-white outline-none focus:ring-2 focus:ring-[#81B7A9]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            <ul className="mb-4 space-y-1 text-sm">
              {validations.map((rule, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircle2
                    size={16}
                    className={rule.valid ? "text-green-500" : "text-gray-300"}
                  />
                  <span
                    className={rule.valid ? "text-green-600" : "text-gray-500"}
                  >
                    {rule.text}
                  </span>
                </li>
              ))}
            </ul>

            {apiError && (
              <p className="text-red-500 text-sm mb-3">{apiError}</p>
            )}

            <button
              type="submit"
              disabled={
                !isFilled ||
                loading ||
                !!emailError ||
                !!usernameError ||
                !validations.every((rule) => rule.valid)
              }
              className={`w-full h-[45px] mb-4 rounded-lg font-medium text-white shadow-md transition-colors duration-300 flex items-center justify-center ${
                isFilled &&
                !loading &&
                !emailError &&
                !usernameError &&
                validations.every((rule) => rule.valid)
                  ? "bg-[#81B7A9] hover:bg-[#6EA092]"
                  : "bg-[#C0DCD6] cursor-not-allowed"
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "REGISTER"
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-[#8D8D8D] text-[15px] mb-1">
              Sudah Punya Akun ?
            </p>
            <p className="text-[#EDB720] text-[16px] font-semibold">
              <Link href="/auth/login">Log in disini!</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
