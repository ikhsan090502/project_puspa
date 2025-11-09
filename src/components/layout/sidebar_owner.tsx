"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/api/logout";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Settings,
  LogOut,
} from "lucide-react";

interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  action?: () => void;
}

const menuItems: MenuItem[] = [
  {
    name: "Dashboard",
    href: "/owner/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Verifikasi Admin",
    href: "/owner/verifikasi-admin",
    icon: UserCheck,
  },
  {
    name: "Verifikasi Terapis",
    href: "/owner/verifikasi-terapis",
    icon: Users,
  },
  {
    name: "Pengaturan",
    href: "/owner/pengaturan",
    icon: Settings,
  },
  {
    name: "Logout",
    href: "#",
    icon: LogOut,
    action: logout,
  },
];

export default function SidebarOwner() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-[#36315B] text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[#4A4A4A]">
        <h1 className="text-xl font-bold">Puspa Owner</h1>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems
            .filter(item => item.name !== "Logout")
            .map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-[#81B7A9] text-[#36315B]"
                        : "hover:bg-[#4A4A4A]"
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-[#4A4A4A]">
        {menuItems
          .filter(item => item.name === "Logout")
          .map((item) => (
            <button
              key={item.name}
              onClick={item.action}
              className="flex items-center w-full px-4 py-3 text-left rounded-lg hover:bg-[#4A4A4A] transition-colors"
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </button>
          ))}
      </div>
    </div>
  );
}