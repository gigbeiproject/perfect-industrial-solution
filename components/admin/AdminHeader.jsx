"use client";

import { useRouter, usePathname } from "next/navigation";
import { LogOut, UserCircle } from "lucide-react";
import toast from "react-hot-toast";

const TITLES = {
  "/admin/dashboard": "Dashboard",
  "/admin/hero": "Hero Slides",
  "/admin/about": "About Us",
  "/admin/categories": "Product Categories",
  "/admin/products": "Products",
  "/admin/gallery": "Gallery",
  "/admin/blog": "Blog Posts",
  "/admin/testimonials": "Testimonials",
  "/admin/clients": "Trusted Clients",
  "/admin/inquiries": "Product Inquiries",
  "/admin/contact-messages": "Contact Inquiries",
  "/admin/settings": "Company Settings",
};

function resolveTitle(pathname) {
  const exact = TITLES[pathname];
  if (exact) return exact;
  const match = Object.keys(TITLES).find((key) => pathname.startsWith(key + "/"));
  return match ? TITLES[match] : "Admin Panel";
}

export default function AdminHeader({ adminName }) {
  const router = useRouter();
  const pathname = usePathname();
  const title = resolveTitle(pathname);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    toast.success("Logged out");
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border-muted bg-white px-5 md:px-8">
      <h1 className="text-base font-bold text-ink md:text-lg">{title}</h1>
      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 text-sm text-muted sm:flex">
          <UserCircle size={20} />
          {adminName || "Administrator"}
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-sm border border-border-muted px-3 py-2 text-xs font-semibold text-ink hover:border-brand hover:text-brand"
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </header>
  );
}
