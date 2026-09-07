"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Images,
  Info,
  Boxes,
  Layers,
  Mail,
  MessageSquare,
  GalleryHorizontal,
  Newspaper,
  Star,
  Building2,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { LogoMark } from "@/components/ui/Logo";

const NAV_GROUPS = [
  {
    items: [{ href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Website Content",
    items: [
      { href: "/admin/hero", label: "Hero Slides", icon: Images },
      { href: "/admin/about", label: "About Us", icon: Info },
      { href: "/admin/categories", label: "Product Categories", icon: Layers },
      { href: "/admin/products", label: "Products", icon: Boxes },
      { href: "/admin/gallery", label: "Gallery", icon: GalleryHorizontal },
      { href: "/admin/blog", label: "Blog Posts", icon: Newspaper },
      { href: "/admin/testimonials", label: "Testimonials", icon: Star },
      { href: "/admin/clients", label: "Trusted Clients", icon: Building2 },
    ],
  },
  {
    title: "Leads",
    items: [
      { href: "/admin/inquiries", label: "Product Inquiries", icon: MessageSquare },
      { href: "/admin/contact-messages", label: "Contact Inquiries", icon: Mail },
    ],
  },
  {
    title: "System",
    items: [{ href: "/admin/settings", label: "Company Settings", icon: Settings }],
  },
];

function SidebarContent({ pathname, onNavigate }) {
  return (
    <div className="flex h-full flex-col bg-ink">
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
        <LogoMark size={36} />
        <div className="leading-tight">
          <p className="text-sm font-bold text-white">Perfect Industrial</p>
          <p className="text-[11px] text-white/50">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {NAV_GROUPS.map((group, i) => (
          <div key={i} className="mb-5">
            {group.title && (
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-white/35">
                {group.title}
              </p>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active =
                  pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={`flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-brand text-white"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon size={17} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="fixed inset-y-0 w-64">
          <SidebarContent pathname={pathname} />
        </div>
      </aside>

      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white shadow-lg lg:hidden"
      >
        <Menu size={22} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="relative w-64 shadow-2xl">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-3 z-10 text-white"
            >
              <X size={20} />
            </button>
            <SidebarContent pathname={pathname} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
