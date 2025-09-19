"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function TimerKirimUlangPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  return (
    <main className="layout-main min-h-screen flex flex-col items-center justify-center font-playpen">
      <header className="header flex justify-left" style={{ marginTop: 24, marginBottom: 24 }}>
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
        
          <h2
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: "#36315B",
              textAlign: "center",
              marginTop: 16,
              marginBottom: 8,
            }}
          >
            Silahkan cek Email Anda.
          </h2>

       
          <p
            style={{
              fontSize: 12,
              color: "#36315B",
              textAlign: "center",
              marginBottom: 24,
            }}
          >
            Kami sudah mengirim link reset ke email{" "}
            <span style={{ fontWeight: "bold" }}>puspa@puspa.com</span>.<br />
          </p>

          
          <div className="text-center" style={{ marginTop: 8, marginBottom: 24 }}>
            <button
              style={{ fontSize: 14, textDecoration: "none" }}
              onClick={() => alert("Email sudah dikirim ulang!")}
            >
              <div>
                <span style={{ fontWeight: "normal", color: "#8D8D8D" }}>
                  Tidak menerima email?
                </span>
              </div>
              <div>
                <span style={{ fontWeight: "normal", color: "#8D8D8D" }}>
                  Tunggu dalam
                </span>{" "}
                <span style={{ fontWeight: "normal", color: "#EDB720" }}>
                  60 detik
                </span>{" "}
                <span style={{ fontWeight: "normal", color: "#8D8D8D" }}>
                  untuk mengirim ulang
                </span>
              </div>
            </button>
          </div>

         
          <Link href="/login">
            <button
              style={{
                backgroundColor: "#8D8D8D",
                color: "#FFFFFF",
                width: "100%",
                height: 45,
                borderRadius: 8,
                fontWeight: 500,
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                marginTop: 8,
                marginBottom: 16,
                transition: "background-color 0.3s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#6EA092")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#81B7A9")}
            >
              KIRIM ULANG
            </button>
          </Link>

          
          <div className="text-center mt-4">
            <p className="text-[#8D8D8D] text-[15px] mb-1">Kembali?</p>
            <p className="text-[#EDB720] text-[16px] font-normal">
              <Link href="/auth/lupa_password">Klik disini</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
