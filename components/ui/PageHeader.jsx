import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export default function PageHeader({ title, crumbs = [] }) {
  return (
    <section
      className="relative bg-ink py-14 md:py-20"
      style={{
        backgroundImage:
          "linear-gradient(rgba(12,17,29,0.88), rgba(12,17,29,0.88)), url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1920&auto=format&fit=crop')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container-px text-center">
        <h1 className="text-2xl font-extrabold uppercase tracking-wide text-white sm:text-3xl md:text-4xl">
          {title}
        </h1>
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-white/60 sm:text-sm">
          <Link href="/" className="flex items-center gap-1 hover:text-brand">
            <Home size={14} /> Home
          </Link>
          {crumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-2">
              <ChevronRight size={14} />
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-brand">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-brand">{crumb.label}</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
