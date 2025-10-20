import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { checkAuthServer } from "@/lib/checkAuth";

export default async function OrangtuaRootPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/auth/login");

  const auth = await checkAuthServer(token);
  if (!auth.success || auth.role !== "orangtua") redirect("/auth/login");

  redirect("/orangtua/dashboard");
}