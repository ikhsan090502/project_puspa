"use client";

import React from "react";
import Sidebar from "@/components/layout/sidebar_owner";
import Header from "@/components/layout/header_owner";

const therapists = [
  {
    id: 1,
    name: "Rani Setiawati",
    email: "rani.terapis@gmail.com",
    specialization: "Terapi Okupasi",
    registrationDate: "10/09/2025",
  },
  {
    id: 2,
    name: "Andi Saputra",
    email: "andi.speech@gmail.com",
    specialization: "Terapi Wicara",
    registrationDate: "10/09/2025",
  },
  {
    id: 3,
    name: "Nadia Putri",
    email: "nadia.physio@gmail.com",
    specialization: "Fisioterapi",
    registrationDate: "11/09/2025",
  },
  {
    id: 4,
    name: "Budi Santoso",
    email: "budi.paeda@gmail.com",
    specialization: "PLB (Paedagog)",
    registrationDate: "11/09/2025",
  },
];

const VerifikasiTerapisPage: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 text-[#36315B]">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="p-8">
          <section className="bg-white rounded-xl shadow-lg p-6">
            <h1 className="text-2xl font-bold mb-3 pb-2">
              Verifikasi Terapis
            </h1>

            {/* Search Input */}
            <div className="flex justify-end mb-4 relative w-full max-w-xs ml-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
                />
              </svg>
              <input
                type="search"
                placeholder="Search"
                className="border border-gray-300 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#81B7A9] w-full"
              />
            </div>

            {/* Table Data */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    {[
                      { label: "No", width: "w-12" },
                      { label: "Nama Terapis" },
                      { label: "Email" },
                      { label: "Spesialisasi" },
                      { label: "Tanggal Pendaftaran" },
                      { label: "Aksi", width: "w-48" },
                    ].map(({ label, width }) => (
                      <th
                        key={label}
                        className={`py-3 px-4 font-semibold text-[#36315B] border-b-2 ${width || ""}`}
                        style={{ borderBottomColor: "#81B7A9" }}
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {therapists.map(
                    ({ id, name, email, specialization, registrationDate }, idx) => (
                      <tr
                        key={id}
                        className={`border-b ${
                          idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                        style={{ borderBottomColor: "#81B7A9" }}
                      >
                        <td className="py-3 px-4">{id}</td>
                        <td className="py-3 px-4">{name}</td>
                        <td className="py-3 px-4 text-[#757575]">{email}</td>
                        <td className="py-3 px-4 text-[#757575]">{specialization}</td>
                        <td className="py-3 px-4 text-[#757575]">
                          {registrationDate}
                        </td>

                        <td className="py-3 px-4 flex gap-3">
                          {/* Approve */}
                          <button className="bg-green-500 text-white px-3 py-1 rounded-md flex items-center gap-1 hover:bg-green-600 transition">
                            ✅ Setujui
                          </button>

                          {/* Reject */}
                          <button className="bg-red-600 text-white px-3 py-1 rounded-md flex items-center gap-1 hover:bg-red-700 transition">
                            ❌ Tolak
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default VerifikasiTerapisPage;
