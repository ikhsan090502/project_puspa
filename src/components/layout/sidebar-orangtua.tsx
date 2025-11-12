"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Baby,
  UserSquare2,
  HelpCircle,
  ChevronRight,
} from "lucide-react";

export const menuOrangtua = [
  {
    name: "Dashboard",
    icon: <LayoutGrid size={20} />,
    path: "/orangtua/dashboard",
  },
  {
    name: "Anak",
    icon: <Baby size={20} />,
    path: "/orangtua/anak",
  },
  {
    name: "Assessment",
    icon: <UserSquare2 size={20} />,
    path: "/orangtua/assessment",
  },
  {
    name: "Help",
    icon: <HelpCircle size={20} />,
    path: "/orangtua/help",
  },
];

export default function SidebarOrangtua() {
  const pathname = usePathname();

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col z-50">
      {/* Logo Section */}
      <div className="flex items-center justify-center mt-8 mb-12">
        <Image
          src="/logo.png"
          alt="Puspa Logo"
          width={140}
          height={60}
          priority
        />
      </div>

      {/* Menu Section */}
      <div className="flex-1 space-y-2 px-6 overflow-y-auto">
        {menuOrangtua.map((item) => {
          const active = pathname === item.path;
          return (
            <Link key={item.name} href={item.path}>
              <div
                className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-all ${
                  active
                    ? "bg-[#C0DCD6] text-[#36315B] font-semibold"
                    : "text-[#36315B] hover:bg-[#C0DCD6]"
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.name}</span>
                </div>
                <ChevronRight
                  size={18}
                  className={`${active ? "text-[#36315B]" : "text-[#36315B]"}`}
                />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Profile Section */}
      <div className="mt-auto px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/profil.png"
              alt="User Avatar"
              width={36}
              height={36}
              className="rounded-full"
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-[#36315B]">Bunda</span>
              <span className="text-xs text-[#36315B]/70">
                Malaikha
              </span>
            </div>
          </div>
          <ChevronRight size={18} className="text-[#36315B]" />
        </div>
      </div>
    </div>
  );
}
