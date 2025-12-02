"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

export default function UbahProfile() {
  const [profile, setProfile] = useState({
    name: "Nindya Zahra",
    birthdate: "",
    phone: "089472689009",
    email: "nindya@gmail.com",
  });

  return (
    <div className="flex h-screen bg-[#f8f9fc]">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <div className="p-8">
          {/* JUDUL */}
          <h1 className="text-center text-2xl font-semibold text-gray-800 mb-8">
            Informasi Pribadi
          </h1>

          {/* CARD */}
          <div className="bg-white border border-[#8BC3B8] rounded-2xl shadow-sm p-10 w-full max-w-4xl mx-auto flex gap-10">
            {/* FOTO & BUTTON */}
            <div className="flex flex-col items-center">
              <img
                src="/images/profile-placeholder.jpg"
                alt="Profile"
                className="w-40 h-40 object-cover rounded-full shadow"
              />

              <button
                className="mt-4 px-5 py-2 rounded-lg border border-[#8BC3B8] text-[#4C8F82] hover:bg-[#8BC3B810]"
              >
                Ubah Profile
              </button>
            </div>

            {/* FORM */}
            <div className="flex-1 grid grid-cols-2 gap-6">
              {/* Nama */}
              <div className="flex flex-col">
                <label className="font-medium text-gray-700 mb-1">Nama</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8BC3B8]"
                />
              </div>

              {/* Tanggal Lahir */}
              <div className="flex flex-col">
                <label className="font-medium text-gray-700 mb-1">
                  Tanggal Lahir
                </label>
                <input
                  type="date"
                  value={profile.birthdate}
                  onChange={(e) =>
                    setProfile({ ...profile, birthdate: e.target.value })
                  }
                  className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8BC3B8]"
                />
              </div>

              {/* Telepon */}
              <div className="flex flex-col">
                <label className="font-medium text-gray-700 mb-1">Telepon</label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                  className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8BC3B8]"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col">
                <label className="font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                  className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8BC3B8]"
                />
              </div>

              {/* TOMBOL PERBARUI */}
              <div className="col-span-2 flex justify-end">
                <button className="bg-[#8BC3B8] hover:bg-[#76aea3] text-white px-6 py-2 rounded-xl shadow">
                  Perbarui
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
