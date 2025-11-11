"use client";

import Image from "next/image";
import { Bell } from "lucide-react";
import { usePathname } from "next/navigation";
import { baseMenu } from "@/components/layout/sidebar_terapis"; // ✅ gunakan baseMenu

export default function HeaderTerapis() {
  const pathname = usePathname();

  const allItems = baseMenu.flatMap((group) => group.items);

  const activeItem =
    allItems.find(
      (item) =>
        pathname === item.href ||
        pathname.startsWith(item.href + "/") ||
        (item.dropdown &&
          item.dropdown.some((sub) => pathname.startsWith(sub.href)))
    ) || null;

   const pageTitles: Record<string, string> = {
    "/terapis/dashboard": "Dashboard",
    "/terapis/observasi": "Observasi",
    "/terapis/asessment": "Asesmen",
    "/terapis/asessment/wicaraAsesment": "Asesmen Terapi Wicara",
    "/terapis/asessment/plbAsesment": "Asesmen (PLB) Paedagog",
    "/terapis/asessment/okupasiAsesment": "Asesmen Terapi Okupasi",
    "/terapis/intervensi": "Intervensi",
    "/terapis/konferensi": "Konferensi",
    "/terapis/sinergi": "Sinergi Program",
    "/terapis/evaluasi": "Evaluasi",
  };

  const title =
    pageTitles[pathname] ||
    activeItem?.dropdown?.find((sub) => pathname.startsWith(sub.href))?.name ||
    activeItem?.name ||
    "Dashboard";

  return (
    <header className="w-full flex justify-between items-center px-6 py-4 bg-white shadow text-[#36315B]">
      <h2 className="text-xl font-semibold">{title}</h2>

      <div className="flex items-center gap-4">
        <span className="font-medium">Hallo, Terapis Puspa</span>

        <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300">
          <Image
            src="/profil.png"
            alt="Terapis"
            width={40}
            height={40}
            className="object-cover"
          />
        </div>

        <button className="relative flex items-center justify-center w-10 h-10 border border-[#36315B] rounded-lg hover:bg-[#81B7A9] hover:text-white transition">
          <Bell className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
