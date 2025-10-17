"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function TerimakasihPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#B8E8DB] font-playpen flex flex-col">
      {/* Header */}
      <header className="bg-white flex items-center px-8 py-3 shadow-md w-full">
        <Image
          src="/logo.png"
          alt="Logo Puspa"
          width={150}
          height={51}
          priority
        />
      </header>

      {/* Konten utama */}
      <div className="flex flex-col items-center justify-center text-center flex-1 px-4">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-extrabold text-2xl md:text-3xl text-[#36315B] mb-4"
        >
          Terimakasih telah mengisi Form!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-[#36315B] text-base md:text-lg max-w-xl mb-8"
        >
          Kami senang dapat mendukung setiap langkah tumbuh kembang anak Anda.
          Admin akan menghubungi via WhatsApp untuk informasi selanjutnya.
        </motion.p>

        {/* Tombol ke Login */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/auth/login")}
          className="px-8 py-3 bg-[#81B7A9] text-white rounded-full shadow-md font-medium hover:bg-[#36315B] transition-colors duration-300"
        >
          Login
        </motion.button>
      </div>
    </main>
  );
}
