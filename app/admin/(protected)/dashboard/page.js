"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Boxes,
  Images,
  Newspaper,
  MessageSquare,
  Mail,
  Bell,
  ArrowRight,
} from "lucide-react";
import { Loading } from "@/components/admin/Bits";

const CARDS = [
  { key: "totalProducts", label: "Total Products", icon: Boxes, href: "/admin/products", color: "bg-blue-50 text-blue-600" },
  { key: "totalInquiries", label: "Total Inquiries", icon: MessageSquare, href: "/admin/inquiries", color: "bg-purple-50 text-purple-600" },
  { key: "newInquiries", label: "New Inquiries", icon: Bell, href: "/admin/inquiries", color: "bg-brand-light text-brand" },
  { key: "totalContactMessages", label: "Contact Messages", icon: Mail, href: "/admin/contact-messages", color: "bg-green-50 text-green-600" },
  { key: "totalHeroSlides", label: "Hero Slides", icon: Images, href: "/admin/hero", color: "bg-pink-50 text-pink-600" },
  { key: "totalBlogPosts", label: "Blog Posts", icon: Newspaper, href: "/admin/blog", color: "bg-amber-50 text-amber-600" },
];

export default function DashboardPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then(setStats)
      .catch(() => setStats({}));
  }, []);

  if (!stats) return <Loading label="Loading dashboard..." />;

  return (
    <div>
      <p className="mb-6 text-sm text-muted">
        Overview of your website content and incoming leads.
      </p>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.key}
              href={card.href}
              className="card-shadow group flex items-center justify-between rounded-sm border border-border-muted bg-white p-5 transition-transform hover:-translate-y-0.5"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {card.label}
                </p>
                <p className="mt-2 text-3xl font-extrabold text-ink">{stats[card.key] ?? 0}</p>
              </div>
              <span className={`flex h-12 w-12 items-center justify-center rounded-full ${card.color}`}>
                <Icon size={22} />
              </span>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 rounded-sm border border-border-muted bg-white p-6 card-shadow">
        <h2 className="text-sm font-bold text-ink">Quick Actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {[
            ["Add Hero Slide", "/admin/hero"],
            ["Add Product", "/admin/products"],
            ["Add Blog Post", "/admin/blog"],
            ["View Inquiries", "/admin/inquiries"],
            ["Company Settings", "/admin/settings"],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="inline-flex items-center gap-1.5 rounded-sm border border-border-muted px-4 py-2 text-xs font-semibold text-ink hover:border-brand hover:text-brand"
            >
              {label}
              <ArrowRight size={13} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
