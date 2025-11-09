"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Home, RefreshCw, ArrowLeft } from "lucide-react";

interface ErrorPageProps {
  error?: Error;
  reset?: () => void;
  statusCode?: number;
}

export default function ErrorPage({ error, reset, statusCode }: ErrorPageProps) {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    // Get user role from cookies
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    const role = getCookie("role");
    setUserRole(role || "");
  }, []);

  const getDashboardPath = () => {
    switch (userRole) {
      case "admin":
        return "/admin/dashboard";
      case "terapis":
      case "asesor":
        return "/terapis/dashboard";
      case "owner":
        return "/owner/dashboard";
      case "orangtua":
        return "/orangtua/dashboard";
      default:
        return "/";
    }
  };

  const getErrorMessage = () => {
    if (statusCode === 404) {
      return {
        title: "Halaman Tidak Ditemukan",
        description: "Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.",
        icon: "🔍"
      };
    } else if (statusCode === 500) {
      return {
        title: "Kesalahan Server",
        description: "Terjadi kesalahan pada server. Silakan coba lagi nanti.",
        icon: "⚠️"
      };
    } else {
      return {
        title: "Terjadi Kesalahan",
        description: "Ada masalah dengan halaman ini. Silakan coba lagi atau kembali ke dashboard.",
        icon: "🚫"
      };
    }
  };

  const errorInfo = getErrorMessage();

  const handleGoHome = () => {
    router.push(getDashboardPath());
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleRetry = () => {
    if (reset) {
      reset();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#B8E8DB] to-[#81B7A9] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-[0_4px_20px_#ADADAD] p-8 text-center">
        {/* Error Image */}
        <div className="mb-6">
          <Image
            src="/error-page.png"
            alt="Error Illustration"
            width={200}
            height={150}
            className="mx-auto"
            priority
          />
        </div>

        {/* Error Icon */}
        <div className="text-4xl mb-4">{errorInfo.icon}</div>

        {/* Error Title */}
        <h1 className="text-2xl font-bold text-[#36315B] mb-3">
          {errorInfo.title}
        </h1>

        {/* Error Description */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          {errorInfo.description}
        </p>

        {/* Error Code (if available) */}
        {statusCode && (
          <div className="bg-gray-100 rounded-lg px-4 py-2 mb-6 inline-block">
            <span className="text-sm font-mono text-gray-700">
              Error Code: {statusCode}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleGoHome}
            className="w-full bg-[#81B7A9] hover:bg-[#36315B] text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Kembali ke Dashboard
          </button>

          <div className="flex gap-3">
            <button
              onClick={handleGoBack}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </button>

            <button
              onClick={handleRetry}
              className="flex-1 bg-[#36315B] hover:bg-[#81B7A9] text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Coba Lagi
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Jika masalah berlanjut, silakan hubungi administrator sistem.
          </p>
        </div>
      </div>
    </div>
  );
}