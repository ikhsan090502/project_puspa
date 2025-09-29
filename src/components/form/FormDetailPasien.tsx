"use client";

import React from "react";

interface Pendamping {
    nama: string;
    hubungan: "Ayah" | "Ibu" | "Wali";
    usia: string;
    pekerjaan: string;
    telepon: string;
}

interface Pasien {
    id: number;
    nama: string;
    agama: string;
    tanggal_lahir: string;
    jenis_kelamin: string;
    alamat: string;
    asal_sekolah: string;
    ditambahkan: string;
    diubah: string;
    pendamping: Pendamping[];
    keluhan?: string;
    layanan?: string[];
}

function hitungUsia(tanggalLahir: string): string {
    if (!tanggalLahir) return "-";

    const lahir = new Date(tanggalLahir);
    const sekarang = new Date();

    let tahun = sekarang.getFullYear() - lahir.getFullYear();
    let bulan = sekarang.getMonth() - lahir.getMonth();

    if (bulan < 0) {
        tahun--;
        bulan += 12;
    }

    return `${tahun} Tahun ${bulan} Bulan`;
}

function formatTanggal(tanggal: string): string {
    if (!tanggal) return "-";

    const d = new Date(tanggal);
    const options: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "long",
        year: "numeric",
    };

    return d.toLocaleDateString("id-ID", options);
}

export default function FormDetailPasien({
    open,
    onClose,
    pasien,
}: {
    open: boolean;
    onClose: () => void;
    pasien: Pasien | null;
}) {
    if (!open || !pasien) return null;

    const ayah = pasien.pendamping.find((p) => p.hubungan === "Ayah");
    const ibu = pasien.pendamping.find((p) => p.hubungan === "Ibu");
    const wali = pasien.pendamping.find((p) => p.hubungan === "Wali");

    const renderPendamping = (label: string, data?: Pendamping) => (
        <div className="mt-2">
            <p className="font-medium">{label}</p>
            <ul className="text-sm text-[#36315B] space-y-1 ml-3">
                <li>• Nama {label} : {data?.nama || "-"}</li>
                <li>• Hubungan : {data?.hubungan || "-"}</li>
                <li>• Usia : {data?.usia || "-"}</li>
                <li>• Pekerjaan : {data?.pekerjaan || "-"}</li>
                <li>• Nomor Telpon : {data?.telepon || "-"}</li>
            </ul>
        </div>
    );
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
            <div className="bg-white rounded-lg shadow-lg w-[450px] max-h-[90vh] overflow-y-auto p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute right-3 top-3 text-gray-600 hover:text-[#81B7A9]"
                >
                    ✕
                </button>

                <h2 className="text-lg font-semibold text-[#36315B] mb-3">
                    Detail Pasien
                </h2>
                <hr className="border-t border-[#81B7A9] mb-3" />

                {/* Informasi Pasien */}
                <p className="text-sm font-medium text-[#36315B]">Informasi Anak</p>
                <ul className="text-sm text-[#36315B] space-y-1 mt-2">
                    <li>• Nama Lengkap : {pasien.nama}</li>
                    <li>• Tempat, Tanggal Lahir : {formatTanggal(pasien.tanggal_lahir)}</li>
                    <li>• Usia : {hitungUsia(pasien.tanggal_lahir)}</li>
                    <li>• Jenis Kelamin : {pasien.jenis_kelamin}</li>
                    <li>• Agama : {pasien.agama}</li>
                    <li>• Asal Sekolah : {pasien.asal_sekolah}</li>
                    <li>• Alamat : {pasien.alamat}</li>
                    <li>• Tanggal Ditambahkan : {pasien.ditambahkan}</li>
                    <li>• Tanggal Diubah : {pasien.diubah}</li>
                </ul>

                {/* Informasi Orangtua / Wali */}
                <div className="mt-4">
                    <p className="text-sm font-medium text-[#36315B]">Informasi Orangtua / Wali</p>
                    {renderPendamping("Ayah", ayah)}
                    {renderPendamping("Ibu", ibu)}
                    {renderPendamping("Wali (Jika Ada)", wali)}
                </div>

                {/* Keluhan */}
                {pasien.keluhan && (
                    <div className="mt-4">
                        <p className="text-sm font-medium text-[#36315B]">Keluhan</p>
                        <p className="text-sm text-[#36315B] mt-1">{pasien.keluhan}</p>
                    </div>
                )}

                {/* Layanan Terpilih */}
                {pasien.layanan && (
                    <div className="mt-4">
                        <p className="text-sm font-medium text-[#36315B]">Layanan Terpilih</p>
                        <ul className="text-sm text-[#36315B] space-y-1 mt-1 ml-3">
                            {pasien.layanan.map((layanan, i) => (
                                <li key={i}>• {layanan}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}