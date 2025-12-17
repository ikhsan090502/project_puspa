"use client";

import Image from "next/image";
import { Bell } from "lucide-react";
import { usePathname } from "next/navigation";
import { baseMenu } from "@/components/layout/sidebar_terapis";
import { useTherapistProfile } from "@/context/ProfileTerapisContext";

interface HeaderTerapisProps {
  pageTitle?: string;
}

export default function HeaderTerapis({ pageTitle }: HeaderTerapisProps) {
  const pathname = usePathname();
  const { profile } = useTherapistProfile();

  const allItems = baseMenu.flatMap((group) => group.items);
  const activeItem =
    allItems.find(
      (item) =>
        pathname === item.href ||
        pathname.startsWith(item.href + "/") ||
        (item.dropdown &&
          item.dropdown.some((sub) => pathname.startsWith(sub.href)))
    ) || null;

  const title = pageTitle || activeItem?.name || "Dashboard";

  return (
    <header className="w-full flex justify-between items-center px-6 py-4 bg-white shadow text-[#36315B]">
      <h2 className="text-xl font-semibold">{title}</h2>

      <div className="flex items-center gap-4">
        <span className="font-medium">
          Hallo, {profile?.therapist_name || "Terapis"}
        </span>

        <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300">
          <Image
            key={profile?.profile_picture || "default"} // 🔥 PAKSA REMOUNT
            src={profile?.profile_picture || "/profil.png"}
            alt="Terapis"
            width={40}
            height={40}
            className="object-cover"
            unoptimized // 🔥 MATIKAN CACHE NEXT IMAGE
          />
        </div>

        <button className="relative flex items-center justify-center w-10 h-10 border border-[#36315B] rounded-lg hover:bg-[#81B7A9] hover:text-white transition">
          <Bell className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
