import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";

export default async function AdminRootPage() {
  const session = await getAdminSession();
  redirect(session ? "/admin/dashboard" : "/admin/login");
}
