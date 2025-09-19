"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validations = [
    { text: "Minimal 8 karakter", valid: password.length >= 8 },
    { text: "Diawali huruf kapital", valid: /^[A-Z]/.test(password) },
    { text: "Terdapat angka", valid: /\d/.test(password) },
    { text: "Terdapat simbol (!@#%&)", valid: /[!@#%&]/.test(password) },
  ];

  return (
    <main className="min-h-screen flex flex-col bg-[#C9EAE0]">
      <header className="flex items-start p-6">
        <Image src="/logo.png" alt="Logo Puspa" width={160} height={50} priority />
      </header>

      
      <div className="flex justify-center flex-1 items-start mt-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white w-[430px] rounded-2xl shadow-[0_4px_20px_#ADADAD] p-6"

        >
          
          <h2 className="text-[20px] font-extrabold text-[#36315B] mb-4">
            Reset Password
          </h2>

         
          <label className="text-[14px] text-[#36315B] block mb-2">
            Masukkan Password Baru
          </label>
          <div className="relative mb-2">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full h-[45px] rounded-lg px-3 pr-10 py-2 border border-[#ADADAD] bg-white outline-none focus:ring-2 focus:ring-[#81B7A9]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

       
          <ul className="mb-4 space-y-1">
            {validations.map((rule, idx) => (
              <li key={idx} className="flex items-center text-[13px]">
                <CheckCircle2
                  size={16}
                  className={rule.valid ? "text-green-500 mr-2" : "text-gray-300 mr-2"}
                />
                <span className={rule.valid ? "text-green-600" : "text-gray-500"}>
                  {rule.text}
                </span>
              </li>
            ))}
          </ul>

        
          <label className="text-[14px] text-[#36315B] block mb-2">
            Konfirmasi Password
          </label>
          <div className="relative mb-6">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Password"
              className="w-full h-[45px] rounded-lg px-3 pr-10 py-2 border border-[#ADADAD] bg-white outline-none focus:ring-2 focus:ring-[#81B7A9]"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <Link href="/auth/berhasil_ubah_password">
            <button className="w-full h-[45px] rounded-lg font-medium text-white bg-[#81B7A9] hover:bg-[#6EA092] transition-colors">
              SIMPAN
            </button>
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
