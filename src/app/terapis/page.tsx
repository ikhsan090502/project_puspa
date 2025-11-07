import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { checkAuth } from "@/lib/checkAuth";

export default async function TerapisRootPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/auth/login");

  const auth = await checkAuth();
  if (!auth.success || (auth.role !== "terapis" && auth.role !== "asesor")) redirect("/auth/login");

  redirect("/terapis/dashboard");
}