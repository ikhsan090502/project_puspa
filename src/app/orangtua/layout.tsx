import { ProfileProvider } from "@/context/ProfileContext";
import Sidebar from "@/components/layout/sidebar-orangtua";
import Header from "@/components/layout/header-orangtua";

export default function OrangtuaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProfileProvider>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Header />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </ProfileProvider>
  );
}
