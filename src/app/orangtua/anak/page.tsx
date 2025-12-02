"use client";

import React, { useEffect, useState } from "react";
import { FaEye, FaPen, FaTrash } from "react-icons/fa";

import SidebarOrangtua from "@/components/layout/sidebar-orangtua";
import HeaderOrangtua from "@/components/layout/header-orangtua";

// API
import { getChildren, ChildItem } from "@/lib/api/childrenAsesment";

export default function ChildList() {
  const [children, setChildren] = useState<ChildItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const res = await getChildren();
      setChildren(res.data || []);
      setLoading(false);
    }
    loadData();
  }, []);

  return (
     <div className="flex min-h-screen bg-gray-50">
       <SidebarOrangtua />
 
       <div className="flex-1 flex flex-col ml-64">
         <HeaderOrangtua />
 
        

        <div className="p-6">
          <h1 className="text-xl font-semibold mb-4"></h1>

          {loading ? (
            <p className="text-gray-600">Memuat data...</p>
          ) : (
            <div className="flex gap-4 flex-wrap">
              {children.map((child) => (
                <div
                  key={child.child_id}
                  className="border rounded-lg p-4 w-60 shadow-sm flex flex-col gap-2 bg-white"
                >
                  <div className="flex items-center gap-2">
                    <div className="bg-green-200 text-green-800 rounded-full w-10 h-10 flex items-center justify-center">
                      👶
                    </div>

                    <div className="flex-1">
                      <h2 className="font-semibold">{child.child_name}</h2>
                      <p className="text-sm text-gray-500">{child.child_birth_date}</p>
                      <p className="text-sm text-gray-500 capitalize">
                        {child.child_gender}
                      </p>
                    </div>

                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-800">
                      Aktif
                    </span>
                  </div>

                  <div className="flex justify-end gap-2 mt-2">
                    <button className="text-gray-500 hover:text-gray-800">
                      <FaEye />
                    </button>
                    <button className="text-blue-500 hover:text-blue-700">
                      <FaPen />
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}

              {/* Tombol Tambah */}
              <button className="border-dashed border-2 border-gray-300 rounded-lg w-60 h-32 flex items-center justify-center text-gray-500 hover:border-gray-400 hover:text-gray-700 bg-white">
                + Tambah Anak
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
