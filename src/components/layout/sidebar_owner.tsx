"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  ShieldCheck,
  Settings,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  activePage?: string;
}

export const menu = [
  {
    section: null,
    items: [{ name: "Dashboard", href: "/owner/dashboard_Owner", icon: LayoutGrid }],
  },
  {
    section: "MANAJEMEN AKUN",
    items: [
      {
        name: "Verifikasi Admin",
        href: "/owner/verifAdmin",
        icon: ShieldCheck,
      },
      {
        name: "Verifikasi Terapis",
        href: "/admin/verifikasi_terapis",
        icon: ShieldCheck,
      },
    ],
  },
  {
    section: "KELOLA AKUN",
    items: [
      { name: "Pengaturan", href: "/pengaturan", icon: Settings },
      { name: "Log Out", href: "/auth/login", icon: LogOut },
    ],
  },
];

export default function Sidebar({ activePage }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-white shadow-md shadow-[#ADADAD] p-6 flex flex-col">
      {/* Logo */}
      <div className="flex justify-center mb-8">
        <Image
          src="/logo.png"
          alt="Logo Puspa"
          width={160}
          height={50}
          priority
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto space-y-8">
        {menu.map((group, idx) => (
          <div key={idx}>
            {group.section && (
              <p className="text-xs font-bold uppercase mb-3 text-[#36315B] tracking-widest">
                {group.section}
              </p>
            )}
            <div className="space-y-1">
              {group.items.map((item, i) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/") ||
                  activePage === item.name.toLowerCase();

                return (
                  <Link
                    key={i}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm group ${
                      isActive
                        ? "bg-[#C0DCD6] text-[#36315B] font-semibold"
                        : "text-[#36315B] hover:bg-[#81B7A9] hover:text-white"
                    }`}
                  >
                    <item.icon
                      size={20}
                      className={`${
                        isActive
                          ? "text-[#36315B]"
                          : "text-[#36315B] group-hover:text-white"
                      }`}
                    />
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
