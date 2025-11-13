"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutGrid,
  UserCog,
  UserSquare2,
  Users,
  CalendarDays,
  FileText,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";

interface SidebarProps {
  activePage?: string;
}

export const menu = [
  {
    section: null,
    items: [{ name: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid }],
  },
  {
    section: "Manajemen Data",
    items: [
      { name: "Admin", href: "/admin/data_admin", icon: UserCog },
      { name: "Terapis", href: "/admin/data_terapis", icon: UserSquare2 },
      { name: "Pasien / Anak", href: "/admin/data_pasien", icon: Users },
      {
        name: "Jadwal",
        href: "/admin/jadwal",
        icon: CalendarDays,
        subItems: [
          { name: "Observasi", href: "/admin/jadwal_observasi" },
          { name: "Asesmen", href: "/admin/jadwal_asesmen" },
        ],
      },
    ],
  },
  {
    section: "Dokumen",
    items: [{ name: "Laporan", href: "/laporan", icon: FileText }],
  },
  {
    section: "Kelola Akun",
    items: [
      { name: "Pengaturan", href: "/pengaturan", icon: Settings },
      { name: "Log Out", href: "/auth/login", icon: LogOut },
    ],
  },
];

export default function Sidebar({ activePage }: SidebarProps) {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <aside className="w-64 min-h-screen bg-white shadow-md shadow-[#ADADAD] p-4 flex flex-col">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <Image
          src="/logo.png"
          alt="Logo Puspa"
          width={160}
          height={50}
          priority
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto pb-8 space-y-6">
        {menu.map((group, idx) => (
          <div key={idx}>
            {group.section && (
              <p className="text-xs font-bold uppercase mb-2 text-[#36315B] tracking-wide">
                {group.section}
              </p>
            )}
            <div className="space-y-1">
              {group.items.map((item, i) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/") ||
                  activePage === item.name.toLowerCase();

                // Jika item punya dropdown (subItems)
                if (item.subItems) {
                  const isOpen = openDropdown === item.name;
                  return (
                    <div key={i} className="space-y-1">
                      <button
                        onClick={() => toggleDropdown(item.name)}
                        className={`flex w-full items-center justify-between gap-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive
                            ? "bg-[#C0DCD6] text-[#36315B] font-semibold"
                            : "text-[#36315B] hover:bg-[#81B7A9] hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon size={20} />
                          <span>{item.name}</span>
                        </div>
                        <ChevronDown
                          size={16}
                          className={`transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="ml-8 mt-1 space-y-1">
                          {item.subItems.map((sub, j) => {
                            const isSubActive =
                              pathname === sub.href ||
                              pathname.startsWith(sub.href + "/");

                            return (
                              <Link
                                key={j}
                                href={sub.href}
                                className={`block px-3 py-1.5 text-sm rounded-lg transition-colors ${
                                  isSubActive
                                    ? "bg-[#C0DCD6] text-[#36315B] font-semibold"
                                    : "text-[#36315B] hover:bg-[#81B7A9] hover:text-white"
                                }`}
                              >
                                {sub.name}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                // Jika item biasa (tanpa dropdown)
                return (
                  <Link
                    key={i}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-[#C0DCD6] text-[#36315B] font-semibold"
                        : "text-[#36315B] hover:bg-[#81B7A9] hover:text-white"
                    }`}
                  >
                    <item.icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
