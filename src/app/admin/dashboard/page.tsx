"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import CardInfo from "@/components/dashboard/card_info";
import JadwalTable from "@/components/dashboard/jadwal_table";
import PasienChart from "@/components/dashboard/pasien_chart";
import FormTambahAdmin from "@/components/form/FormTambahAdmin";
import FormTambahTerapis from "@/components/form/FormTambahTerapis";
import { Menu, X } from "lucide-react";

export default function AdminDashboard() {
  const [openTambahAdmin, setOpenTambahAdmin] = useState(false);
  const [openTambahTerapis, setOpenTambahTerapis] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside
        className={`
          fixed md:static z-20 inset-y-0 left-0 w-64 bg-white shadow-md
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <Sidebar />
      </aside>

      

      <button
        className="fixed top-4 left-4 z-30 p-2 rounded-md bg-gray-200 hover:bg-gray-300 md:hidden shadow-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <main className="flex-1 flex flex-col">
        <Header />

        <div className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-1 w-full">
              <CardInfo />
            </div>

            <div className="flex flex-col gap-4 w-full md:w-auto">
              <button
                onClick={() => setOpenTambahAdmin(true)}
                className="px-4 py-2 rounded-lg bg-[#81B7A9] text-white shadow hover:bg-[#6356C1] transition-colors w-full md:w-auto"
              >
                + Tambah Admin
              </button>

              <button
                onClick={() => setOpenTambahTerapis(true)}
                className="px-4 py-2 rounded-lg bg-[#81B7A9] text-white shadow hover:bg-[#6356C1] transition-colors w-full md:w-auto"
              >
                + Tambah Terapis
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <JadwalTable />
            <PasienChart />
          </div>
        </div>
      </main>

      <FormTambahAdmin
        open={openTambahAdmin}
        onClose={() => setOpenTambahAdmin(false)}
        onSave={(data) => {
          console.log("Admin ditambahkan:", data);
          setOpenTambahAdmin(false);
        }}
      />

      <FormTambahTerapis
        open={openTambahTerapis}
        onClose={() => setOpenTambahTerapis(false)}
        onSave={(data) => {
          console.log("Terapis ditambahkan:", data);
          setOpenTambahTerapis(false);
        }}
      />
    </div>
  );
}
