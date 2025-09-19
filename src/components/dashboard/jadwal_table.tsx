"use client";

import { useState } from "react";

const data = [
  { pasien: "Annisa", terapi: "Fisioterapi", terapis: "Orang" },
  { pasien: "Zamzam", terapi: "Fisioterapi", terapis: "Nama Terapis" },
  { pasien: "Nama", terapi: "Terapi Wicara", terapis: "Nama Terapis" },
  { pasien: "Nama", terapi: "Paedagog", terapis: "Nama Terapis" },
];

export default function JadwalTable() {
  const [search, setSearch] = useState("");

  const filteredData = data.filter(
    (row) =>
      row.pasien.toLowerCase().includes(search.toLowerCase()) ||
      row.terapi.toLowerCase().includes(search.toLowerCase()) ||
      row.terapis.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-md shadow-[#ADADAD] p-4 text-[#36315B]">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-lg">Jadwal Terapi Hari Ini</h3>
        <input
          type="text"
          placeholder="Cari..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-[#ADADAD] rounded-lg px-3 py-1 text-sm outline-none focus:ring-2 focus:ring-[#81B7A9]"
        />
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#81B7A9]">
            <th className="text-left">Nama Pasien</th>
            <th className="text-left">Jenis Terapi</th>
            <th className="text-left">Nama Terapis</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, i) => (
            <tr key={i} className="border-b border-[#81B7A9]">
              <td className="py-2">{row.pasien}</td>
              <td>{row.terapi}</td>
              <td>{row.terapis}</td>
            </tr>
          ))}
          {filteredData.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center py-4 text-sm text-gray-500">
                Tidak ada data yang cocok
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
