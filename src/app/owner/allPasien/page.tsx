"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/layout/sidebar_owner";
import Header from "@/components/layout/header_owner";
import { getAllChildren } from "@/lib/api/ownerPasien"; // API LIST ANAK
import { Eye } from "lucide-react";

const DataAnakListPage: React.FC = () => {
  const [children, setChildren] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchChildren();
  }, []);

  async function fetchChildren() {
    const res = await getAllChildren();
    if (res.success) {
      setChildren(res.data);
    }
  }

  const filteredChildren = children.filter(
    (item) =>
      item.child_name.toLowerCase().includes(search.toLowerCase()) ||
      item.child_school.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#F7F7F7] text-[#36315B]">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="p-10">
          <section className="bg-white rounded-xl shadow-md p-6">
            <h1 className="text-2xl font-bold mb-6 pb-2 border-b-2 border-[#81B7A9]">
              Data Pasien / Anak
            </h1>

            {/* Search Bar */}
            <div className="flex justify-end mb-4 relative w-full max-w-xs ml-auto">
              <input
                type="search"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#81B7A9] w-full"
              />
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
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr>
                    {[
                      "No",
                      "Nama Anak",
                      "Tanggal Lahir",
                      "Usia",
                      "Jenis Kelamin",
                      "Asal Sekolah",
                      "Aksi",
                    ].map((label) => (
                      <th
                        key={label}
                        className="py-3 px-4 font-semibold border-b-2"
                        style={{ borderBottomColor: "#81B7A9" }}
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredChildren.map((child, idx) => (
                    <tr
                      key={child.child_id}
                      className={`border-b ${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                      style={{ borderBottomColor: "#81B7A9" }}
                    >
                      <td className="py-3 px-4">{idx + 1}</td>
                      <td className="py-3 px-4">{child.child_name}</td>
                      <td className="py-3 px-4 text-[#757575]">
                        {child.child_birth_date}
                      </td>
                      <td className="py-3 px-4 text-[#757575]">
                        {child.child_age}
                      </td>
                      <td className="py-3 px-4 capitalize">
                        {child.child_gender}
                      </td>
                      <td className="py-3 px-4">{child.child_school}</td>

                      <td className="py-3 px-4">
                        <button className="text-[#36315B] hover:text-[#81B7A9]">
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredChildren.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  Tidak ada data anak.
                </p>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default DataAnakListPage;
