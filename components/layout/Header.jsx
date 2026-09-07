import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import Logo from "@/components/ui/Logo";
import NavLinks from "@/components/layout/NavLinks";
import MobileNav from "@/components/layout/MobileNav";

export default function Header({ settings }) {
  return (
    <header className="sticky top-0 z-40 shadow-sm">
      {/* Top bar */}
      <div className="hidden md:block bg-white border-b border-border-muted">
        <div className="container-px flex h-20 items-center justify-between">
          <Logo settings={settings} variant="dark" />

          <div className="flex items-center gap-8">
            {settings?.email && (
              <div className="flex items-center gap-2 text-sm">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-light text-brand">
                  <Mail size={16} />
                </span>
                <div className="leading-tight">
                  <div className="text-[11px] text-muted">Email Us</div>
                  <a href={`mailto:${settings.email}`} className="font-semibold text-ink">
                    {settings.email}
                  </a>
                </div>
              </div>
            )}
            {settings?.phone && (
              <div className="flex items-center gap-2 text-sm">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-light text-brand">
                  <Phone size={16} />
                </span>
                <div className="leading-tight">
                  <div className="text-[11px] text-muted">Call Us</div>
                  <a href={`tel:${settings.phone}`} className="font-semibold text-ink">
                    {settings.phone}
                  </a>
                </div>
              </div>
            )}
            <Link href="/contact-us" className="btn-primary">
              Get A Quote
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div className="bg-ink">
        <div className="container-px flex h-16 md:h-14 items-center justify-between">
          <div className="md:hidden">
            <Logo settings={settings} variant="light" />
          </div>
          <div className="hidden md:block overflow-x-auto">
            <NavLinks />
          </div>
          <MobileNav settings={settings} />
        </div>
      </div>
    </header>
  );
}
