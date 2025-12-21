"use client";

import React, { useState } from "react";
import SidebarOrangtua from "@/components/layout/sidebar-orangtua";
import HeaderOrangtua from "@/components/layout/header-orangtua";

export default function ResponsiveOrangtuaLayout({
  children,
  maxWidth = "max-w-5xl",
}: {
  children: React.ReactNode;
  maxWidth?: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* MOBILE OVERLAY */}
      <div
        className={`fixed inset-0 z-30 bg-black/30 transition-opacity md:hidden ${
          sidebarOpen ? "opacity-100 block" : "opacity-0 hidden"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* SIDEBAR */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-md transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <SidebarOrangtua />
      </div>

      {/* CONTENT */}
      <div className="flex-1 flex flex-col ml-0 md:ml-64">
        {/* HEADER + HAMBURGER MOBILE */}
        <div className="flex items-center justify-between bg-white shadow-sm px-4 md:px-8 py-2">
          {/* Hamburger mobile */}
          <button
            className="md:hidden p-2 rounded-md focus:outline-none focus:ring mr-2"
            onClick={() => setSidebarOpen(true)}
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <HeaderOrangtua />
        </div>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className={`mx-auto w-full ${maxWidth}`}>{children}</div>
        </main>
      </div>
    </div>
  );
}
