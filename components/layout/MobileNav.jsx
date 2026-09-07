"use client";

import { useState, useEffect } from "react";
import { Menu, X, Phone, Mail } from "lucide-react";
import Logo from "@/components/ui/Logo";
import NavLinks from "@/components/layout/NavLinks";

export default function MobileNav({ settings }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="p-2 text-white"
      >
        <Menu size={26} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />
          <div className="relative ml-auto flex h-full w-[82%] max-w-sm flex-col bg-ink px-6 py-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between">
              <Logo settings={settings} variant="light" />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="p-2 text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mt-6 flex-1 overflow-y-auto">
              <NavLinks orientation="vertical" onNavigate={() => setOpen(false)} />
            </div>

            <div className="mt-6 space-y-3 border-t border-white/10 pt-5">
              {settings?.phone && (
                <a
                  href={`tel:${settings.phone}`}
                  className="flex items-center gap-2 text-sm text-white/80"
                >
                  <Phone size={16} className="text-brand" /> {settings.phone}
                </a>
              )}
              {settings?.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-2 text-sm text-white/80"
                >
                  <Mail size={16} className="text-brand" /> {settings.email}
                </a>
              )}
              <a href="/contact-us" className="btn-primary w-full mt-2">
                Get A Quote
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
