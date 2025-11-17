"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import SidebarOrangtua from "@/components/layout/sidebar-orangtua";
import HeaderOrangtua from "@/components/layout/header-orangtua";

export default function DataUmumIdentitas() {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedSection, setSelectedSection] = useState("Identitas");

  const steps = [
    { label: "Data Umum", path: "/orangtua/assessment/kategori/data-umum" },
    { label: "Data Fisioterapi", path: "/orangtua/assessment/kategori/fisioterapi" },
    { label: "Data Terapi Okupasi", path: "/orangtua/assessment/kategori/okupasi" },
    { label: "Data Terapi Wicara", path: "/orangtua/assessment/kategori/wicara" },
    { label: "Data Paedagog", path: "/orangtua/assessment/kategori/paedagog" },
  ];

  const activeStep = steps.findIndex((step) => pathname.includes(step.path));

  const handleSelectChange = (value: string) => {
    setSelectedSection(value);

    switch (value) {
      case "Identitas":
        router.push("/orangtua/assessment/kategori/data-umum/identitas");
        break;
      case "Riwayat Anak":
        router.push("/orangtua/assessment/kategori/data-umum/riwayat-anak");
        break;
      case "Riwayat Kesehatan":
        router.push("/orangtua/assessment/kategori/data-umum/riwayat-kesehatan");
        break;
      case "Riwayat Pendidikan":
        router.push("/orangtua/assessment/kategori/data-umum/riwayat-pendidikan");
        break;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarOrangtua />

      <div className="flex-1 flex flex-col ml-64">
        <HeaderOrangtua />

        <main className="flex-1 p-6 lg:p-10 text-[#36315B]">
          {/* Stepper */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className="flex items-center cursor-pointer"
                  onClick={() => router.push(step.path)}
                >
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div
                      className={`w-9 h-9 flex items-center justify-center rounded-full border-2 text-sm font-semibold ${
                        i === activeStep
                          ? "bg-[#6BB1A0] border-[#6BB1A0] text-white"
                          : "bg-gray-100 border-gray-300 text-gray-500"
                      }`}
                    >
                      {i + 1}
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        i === activeStep ? "text-[#36315B]" : "text-gray-500"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>

                  {i < steps.length - 1 && (
                    <div className="w-12 h-px bg-gray-300 mx-2 translate-y-[-12px]" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">I. Data Umum</h2>

              {/* Dropdown tetap aktif */}
              <select
                value={selectedSection}
                onChange={(e) => handleSelectChange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-[#36315B]"
              >
                <option>Identitas</option>
                <option>Riwayat Anak</option>
                <option>Riwayat Kesehatan</option>
                <option>Riwayat Pendidikan</option>
              </select>
            </div>

            {/* Anak */}
            <div className="mb-8">
              <h3 className="font-semibold mb-3">1. Anak</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ReadOnly label="Nama" value="Aleyya Karina" />
                <ReadOnly label="Tanggal Lahir" value="26 Agustus 2015" />
                <div className="md:col-span-2">
                  <ReadOnly label="Alamat" value="Jln. Malabar Selatan 10" />
                </div>
              </div>
            </div>

            {/* Orangtua */}
            <div>
              <h3 className="font-semibold mb-3">2. Orangtua</h3>

              {/* Ayah */}
              <div className="mt-4">
                <h4 className="font-medium mb-3">Ayah</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ReadOnly label="Nama Ayah" value="Andi" />
                  <ReadOnly label="Tanggal Lahir" value="-" />
                  <ReadOnly label="Pekerjaan" value="Karyawan Swasta" />
                  <ReadOnly label="Nomor Telepon" value="081x-xxx-xxxx" />
                  <ReadOnly label="Hubungan dengan Anak" value="Ayah kandung" />
                  <ReadOnly label="NIK" value="3272001878909754" />
                </div>
              </div>

              {/* Ibu */}
              <div className="mt-8">
                <h4 className="font-medium mb-3">Ibu</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ReadOnly label="Nama Ibu" value="Sari" />
                  <ReadOnly label="Tanggal Lahir" value="-" />
                  <ReadOnly label="Pekerjaan" value="Ibu Rumah Tangga" />
                  <ReadOnly label="Nomor Telepon" value="081x-xxx-xxxx" />
                  <ReadOnly label="Hubungan dengan Anak" value="Ibu kandung" />
                  <ReadOnly label="NIK" value="327204870395478" />
                </div>
              </div>

              {/* Wali */}
              <div className="mt-8">
                <h4 className="font-medium mb-3">Wali</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ReadOnly label="Nama Wali" value="-" />
                  <ReadOnly label="Tanggal Lahir" value="-" />
                  <ReadOnly label="Pekerjaan" value="-" />
                  <ReadOnly label="Nomor Telepon" value="-" />
                  <ReadOnly label="Hubungan dengan Anak" value="-" />
                  <ReadOnly label="NIK" value="-" />
                  <div className="md:col-span-2">
                    <ReadOnly label="Alamat" value="-" />
                  </div>
                </div>
              </div>
            </div>

            {/* Tombol Simpan (Dinonaktifkan) */}
            <div className="flex justify-end mt-10">
              <button
                disabled
                className="bg-[#6BB1A0] text-white font-medium px-8 py-2 rounded-xl opacity-50 cursor-default"
              >
                Simpan
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* 🔒 Input Read Only */
function ReadOnly({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm text-gray-600 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        readOnly
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-[#36315B] bg-gray-100 cursor-default"
      />
    </div>
  );
}

