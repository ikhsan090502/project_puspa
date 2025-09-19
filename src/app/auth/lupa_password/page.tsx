"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function LupaPasswordPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  return (
    <main className="layout-main min-h-screen flex flex-col items-center justify-center">
      
      <header className="header flex justify-left my-6">
        <Image src="/logo.png" alt="Logo Puspa" width={160} height={50} priority />
      </header>

     
      <div className="form-wrapper flex justify-center w-full shadow-[0_4px_20px_#ADADAD]">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="layout-form"
          style={{ width: 430, height: 350, padding: 20 }}
        >
         
          <h2 className="text-[20px] font-extrabold text-[#36315B] text-center my-4">
            Lupa Password Anda?
          </h2>

         
          <p className="text-[14px] text-[#36315B] text-left mb-2">
            Masukkan alamat Email
          </p>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter email address"
              className="w-full h-[45px] rounded-lg px-3 py-2 border border-[#ADADAD] bg-white outline-none focus:ring-2 focus:ring-[#81B7A9]"
            />
          </div>

         
          <Link href="/auth/timer_kirim_ulang">
            <button
              className="bg-[#81B7A9] text-white w-full h-[45px] rounded-lg font-medium shadow-md mt-2 mb-4 transition-colors hover:bg-[#6EA092]"
            >
              KIRIM EMAIL
            </button>
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
