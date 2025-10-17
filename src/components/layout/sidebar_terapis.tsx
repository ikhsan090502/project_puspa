"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react"; 
import {
  LayoutGrid,
  Search,
  ClipboardList,
  Users,
  Handshake,
  Workflow,
  FileCheck,
} from "lucide-react";

interface SidebarProps {
  activePage?: string;
  isMobile?: boolean;
  onClose?: () => void; 
}

export const menu = [
  {
    section: null,
    items: [{ name: "Dashboard", href: "/terapis/dashboard", icon: LayoutGrid }],
  },
  {
    section: "PENDATAAN",
    items: [
      { name: "Observasi", href: "/terapis/observasi", icon: Search },
      { name: "Asessment", href: "/terapis/asessment", icon: ClipboardList },
    ],
  },
  {
    section: "INTERVENSI & KOLABORASI",
    items: [
      { name: "Konferensi", href: "/terapis/konferensi", icon: Users },
      { name: "Intervensi", href: "/terapis/intervensi", icon: Handshake },
      { name: "Sinergi Program", href: "/terapis/sinergi", icon: Workflow },
    ],
  },
  {
    section: "MONITORING & EVALUASI",
    items: [{ name: "Evaluasi", href: "/terapis/evaluasi", icon: FileCheck }],
  },
];

export default function SidebarTerapis({ activePage }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-white shadow-md shadow-[#ADADAD] p-4 flex flex-col">
  <div className="flex justify-center mb-6">
    <Image src="/logo.png" alt="Logo Puspa" width={160} height={50} priority />
  </div>

  <nav className="flex-1 space-y-6 overflow-y-auto">
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
