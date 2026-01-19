"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { registrationChild, RegistrationPayload } from "@/lib/api/registration";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";

const layananOptions = [
  "Asesmen Tumbuh Kembang",
  "Asesmen Terpadu",
  "Konsultasi Dokter",
  "Konsultasi Psikolog",
  "Konsultasi Keluarga",
  "Test Psikolog",
  "Layanan Minat Bakat",
  "Daycare",
  "Home Care",
  "Hydrotherapy",
  "Baby Spa",
  "Lainnya",
];

interface RegistrationFormProps {
  onSuccess: () => void;
}

export default function RegistrationForm({ onSuccess }: RegistrationFormProps) {
  const [formData, setFormData] = useState({
    namaLengkap: "",
    tempatLahir: "",
    tanggalLahir: "",
    usia: "",
    jenisKelamin: "",
    sekolah: "",
    alamat: "",
    keluhan: "",
    statusOrtu: "",
    orangTua: "",
    nomorTelepon: "",
    email: "",
    pilihanLayanan: [] as string[],
  });

  useEffect(() => {
    if (formData.tanggalLahir) {
      const today = new Date();
      const birthDate = new Date(formData.tanggalLahir);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setFormData((prev) => ({ ...prev, usia: String(age) }));
    }
  }, [formData.tanggalLahir]);

  const mutation = useMutation({
    mutationFn: (payload: RegistrationPayload) => registrationChild(payload),
    onSuccess: () => {
      onSuccess();
    },
    onError: (error: any) => {
      console.error("❌ Error saat submit:", error);
      if (error.response?.data) {
        alert(`Error: ${JSON.stringify(error.response.data)}`);
      } else {
        alert(error.message || "Terjadi kesalahan saat pendaftaran.");
      }
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    if (type === "checkbox") {
      setFormData((prev) => {
        const updated = checked
          ? [...prev.pilihanLayanan, value]
          : prev.pilihanLayanan.filter((v) => v !== value);
        return { ...prev, pilihanLayanan: updated };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let birthDate = formData.tanggalLahir;
    if (birthDate) {
      const date = new Date(birthDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      birthDate = `${year}-${month}-${day}`;
    }

    const payload: RegistrationPayload = {
      child_name: formData.namaLengkap,
      child_gender: formData.jenisKelamin.toLowerCase(),
      child_birth_place: formData.tempatLahir,
      child_birth_date: birthDate,
      child_school: formData.sekolah,
      child_address: formData.alamat,
      child_complaint: formData.keluhan,
      child_service_choice: formData.pilihanLayanan.join(", "), 
      email: formData.email,
      guardian_name: formData.orangTua,
      guardian_phone: formData.nomorTelepon,
      guardian_type: formData.statusOrtu.toLowerCase(),
    };

    mutation.mutate(payload);
  };

  return (
    <div className="min-h-screen bg-[#B8E8DB] pb-5">
      <header className="bg-white flex items-center px-10 py-3 shadow-md mb-5 w-full">
        <Image src="/logo.png" alt="Foto" width={150} height={51} />
      </header>

      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center font-extrabold text-4xl mb-2 text-[#36315B]"
      >
        Form Pendaftaran
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.6 }}
        className="text-center mb-8 text-[#36315B] text-lg font-normal max-w-xl mx-auto"
      >
        Kami senang dapat mendukung setiap langkah tumbuh kembang anak Anda.
        Mohon isi data lengkap di bawah ini agar permohonan Anda segera kami
        proses.
      </motion.p>

      <div className="flex justify-center px-5 mt-3">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-[900px] bg-white rounded-lg p-8 shadow-[0_4px_20px_#ADADAD]"
        >
          <form onSubmit={handleSubmit}>
            <label className="block mb-4">
              Nama Lengkap <span className="text-red-500">*</span>
              <input
                type="text"
                name="namaLengkap"
                value={formData.namaLengkap}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </label>

            <div className="flex gap-3 mb-4">
              <label className="flex-1">
                Tempat Lahir <span className="text-red-500">*</span>
                <input
                  type="text"
                  name="tempatLahir"
                  value={formData.tempatLahir}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                />
              </label>
              <label className="flex-1">
                Tanggal Lahir <span className="text-red-500">*</span>
                <input
                  type="date"
                  name="tanggalLahir"
                  value={formData.tanggalLahir}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                />
              </label>
              <label className="flex-[0.5]">
                Usia
                <input
                  type="number"
                  name="usia"
                  value={formData.usia}
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded mt-1 bg-gray-100"
                />
              </label>
            </div>

            <div className="mb-4">
              Jenis Kelamin <span className="text-red-500">*</span>
              <br />
              <label className="mr-5">
                <input
                  type="radio"
                  name="jenisKelamin"
                  value="laki-laki"
                  checked={formData.jenisKelamin === "laki-laki"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Laki-laki
              </label>
              <label>
                <input
                  type="radio"
                  name="jenisKelamin"
                  value="perempuan"
                  checked={formData.jenisKelamin === "perempuan"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Perempuan
              </label>
            </div>

            <label className="block mb-4">
              Asal Sekolah / Kelas
              <input
                type="text"
                name="sekolah"
                value={formData.sekolah}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </label>

            <label className="block mb-4">
              Alamat <span className="text-red-500">*</span>
              <textarea
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
                required
                rows={3}
                className="w-full p-2 border border-gray-300 rounded mt-1 resize-y"
              />
            </label>

            <label className="block mb-4">
              Keluhan <span className="text-red-500">*</span>
              <textarea
                name="keluhan"
                value={formData.keluhan}
                onChange={handleChange}
                required
                rows={3}
                className="w-full p-2 border border-gray-300 rounded mt-1 resize-y"
              />
            </label>

            <div className="mb-4">
              <label className="mr-5">
                <input
                  type="radio"
                  name="statusOrtu"
                  value="ayah"
                  checked={formData.statusOrtu === "ayah"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Ayah
              </label>
              <label className="mr-5">
                <input
                  type="radio"
                  name="statusOrtu"
                  value="ibu"
                  checked={formData.statusOrtu === "ibu"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Ibu
              </label>
              <label>
                <input
                  type="radio"
                  name="statusOrtu"
                  value="wali"
                  checked={formData.statusOrtu === "wali"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Wali
              </label>
            </div>

            <label className="block mb-4">
              Nama Orang Tua / Wali <span className="text-red-500">*</span>
              <input
                type="text"
                name="orangTua"
                value={formData.orangTua}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </label>

            <label className="block mb-4">
              Nomor Telepon <span className="text-red-500">*</span>
              <input
                type="tel"
                name="nomorTelepon"
                value={formData.nomorTelepon}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </label>

            <label className="block mb-4">
              Email <span className="text-red-500">*</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </label>

            <fieldset className="mb-5">
              <legend>
                Pilih Layanan <span className="text-red-500">*</span>
              </legend>
              <div className="flex flex-wrap gap-2 mt-2">
                {layananOptions.map((layanan) => (
                  <label key={layanan} className="flex-[0_0_45%]">
                    <input
                      type="checkbox"
                      name="pilihanLayanan"
                      value={layanan}
                      checked={formData.pilihanLayanan.includes(layanan)}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    {layanan}
                  </label>
                ))}
              </div>
            </fieldset>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={mutation.isPending}
              className={`w-[130px] h-[45px] bg-[#7AA68D] text-white rounded-full cursor-pointer float-right flex items-center justify-center font-medium shadow-md transition-colors duration-300 ${
                mutation.isPending
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#6a907c]"
              }`}
            >
              {mutation.isPending ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Daftar"
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
