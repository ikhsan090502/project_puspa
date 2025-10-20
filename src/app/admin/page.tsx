import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { checkAuthServer } from "@/lib/checkAuth";

export default async function AdminRootPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/auth/login");

  const auth = await checkAuthServer(token);
  if (!auth.success || auth.role !== "admin") redirect("/auth/login");

  redirect("/admin/dashboard");
}