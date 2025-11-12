"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SidebarOrangtua from "@/components/layout/sidebar-orangtua";
import HeaderOrangtua from "@/components/layout/header-orangtua";

export default function DataUmumIdentitas() {
  const router = useRouter();
  const [selectedSection, setSelectedSection] = useState("Identitas");

  const steps = [
    "Data Umum",
    "Data Fisioterapi",
    "Data Terapi Okupasi",
    "Data Terapi Wicara",
    "Data Paedagog",
  ];

  // 🔄 Navigasi otomatis ketika dropdown berubah
  const handleSelectChange = (value: string) => {
    setSelectedSection(value);

    switch (value) {
      case "Identitas":
        router.push("/orangtua/data-umum/identitas");
        break;
      case "Riwayat Anak":
        router.push("/orangtua/assessment/kategori/data-umum/riwayat-anak");
        break;
      case "Riwayat Kesehatan":
        router.push("/orangtua/data-umum/riwayat-kesehatan");
        break;
      case "Riwayat Pendidikan":
        router.push("/orangtua/data-umum/riwayat-pendidikan");
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarOrangtua />

      <div className="flex-1 flex flex-col ml-64">
        <HeaderOrangtua />


    <main className="flex-1 overflow-y-auto p-8">
    </main>
        <main className="flex-1 p-6 lg:p-10 text-[#36315B]">
          

          <div className="flex justify-center mb-12">
            <div className="flex items-center">
              {steps.map((step, i) => (
                <div key={i} className="flex items-center">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div
                      className={`w-9 h-9 flex items-center justify-center rounded-full border-2 text-sm font-semibold ${
                        i === 0
                          ? "bg-[#6BB1A0] border-[#6BB1A0] text-white"
                          : "bg-gray-100 border-gray-300 text-gray-500"
                      }`}
                    >
                      {i + 1}
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        i === 0 ? "text-[#36315B]" : "text-gray-500"
                      }`}
                    >
                      {step}
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
              <select
                value={selectedSection}
                onChange={(e) => handleSelectChange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-[#36315B] focus:outline-none focus:ring-2 focus:ring-[#6BB1A0]"
              >
                <option>Identitas</option>
                <option>Riwayat Anak</option>
                <option>Riwayat Kesehatan</option>
                <option>Riwayat Pendidikan</option>
              </select>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold mb-3">1. Anak</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-600">Nama</label>
                  <p className="mt-1 font-medium">Aleyya Karina</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Tanggal Lahir</label>
                  <p className="mt-1 font-medium">26 Agustus 2015</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-600">Alamat</label>
                  <p className="mt-1 font-medium">Jln. Malabar Selatan 10</p>
                </div>
              </div>
            </div>

            {/* 2. Orangtua */}
            <div>
              <h3 className="font-semibold mb-3">2. Orangtua</h3>

              {/* Ayah */}
              <div className="mt-4">
                <h4 className="font-medium mb-3">Ayah</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Nama Ayah" placeholder="Misal: Andi" />
                  <Input label="Tanggal Lahir" type="date" />
                  <Input label="Pekerjaan" placeholder="Karyawan Swasta" />
                  <Input label="Nomor Telepon" placeholder="081x-xxx-xxxx" />
                  <Input
                    label="Hubungan dengan Anak"
                    placeholder="Ayah kandung"
                  />
                  <Input label="NIK" placeholder="3272001878909754" />
                </div>
              </div>

              {/* Ibu */}
              <div className="mt-8">
                <h4 className="font-medium mb-3">Ibu</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Nama Ibu" placeholder="Misal: Sari" />
                  <Input label="Tanggal Lahir" type="date" />
                  <Input label="Pekerjaan" placeholder="Ibu Rumah Tangga" />
                  <Input label="Nomor Telepon" placeholder="081x-xxx-xxxx" />
                  <Input
                    label="Hubungan dengan Anak"
                    placeholder="Ibu kandung"
                  />
                  <Input label="NIK" placeholder="327204870395478" />
                </div>
              </div>

              {/* Wali */}
              <div className="mt-8">
                <h4 className="font-medium mb-3">Wali</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Nama Wali" placeholder="-" />
                  <Input label="Tanggal Lahir" type="date" />
                  <Input label="Pekerjaan" placeholder="-" />
                  <Input label="Nomor Telepon" placeholder="-" />
                  <Input label="Hubungan dengan Anak" placeholder="-" />
                  <Input label="NIK" placeholder="-" />
                  <div className="md:col-span-2">
                    <Input label="Alamat" placeholder="-" />
                  </div>
                </div>
              </div>
            </div>

            {/* Tombol Simpan */}
            <div className="flex justify-end mt-10">
              <button className="bg-[#6BB1A0] hover:bg-[#5c9c8d] text-white font-medium px-8 py-2 rounded-xl">
                Simpan
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ✅ Komponen Input sederhana */
function Input({
  label,
  type = "text",
  placeholder,
}: {
  label: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col">
      <label className="text-sm text-gray-600 mb-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-[#36315B] focus:outline-none focus:ring-2 focus:ring-[#6BB1A0]"
      />
    </div>
  );
}
