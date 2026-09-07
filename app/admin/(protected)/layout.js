import { getAdminSession } from "@/lib/auth";
import Sidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export const metadata = { title: "Admin Panel" };

export default async function ProtectedAdminLayout({ children }) {
  const session = await getAdminSession();

  return (
    <div className="min-h-screen bg-surface lg:flex">
      <Sidebar />
      <div className="flex-1 lg:pl-64">
        <AdminHeader adminName={session?.username} />
        <main className="p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
