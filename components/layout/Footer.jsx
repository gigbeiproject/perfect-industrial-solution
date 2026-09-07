import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { FacebookIcon, InstagramIcon, LinkedinIcon, YoutubeIcon } from "@/components/ui/SocialIcons";
import Logo from "@/components/ui/Logo";
import { query } from "@/lib/db";

async function getFooterCategories() {
  try {
    return await query(
      "SELECT name, slug FROM product_categories WHERE status = 1 ORDER BY sort_order ASC LIMIT 6"
    );
  } catch {
    return [];
  }
}

export default async function Footer({ settings }) {
  const categories = await getFooterCategories();
  const year = new Date().getFullYear();

  const socials = [
    { href: settings?.facebook, icon: FacebookIcon, label: "Facebook" },
    { href: settings?.instagram, icon: InstagramIcon, label: "Instagram" },
    { href: settings?.linkedin, icon: LinkedinIcon, label: "LinkedIn" },
    { href: settings?.youtube, icon: YoutubeIcon, label: "YouTube" },
  ].filter((s) => s.href);

  return (
    <footer className="bg-ink text-white/80">
      <div className="container-px section-py grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo settings={settings} variant="light" />
          <p className="mt-4 text-sm leading-relaxed text-white/60">
            {settings?.footer_description ||
              "We provide complete industrial solutions with a wide range of quality products and reliable services."}
          </p>
          {socials.length > 0 && (
            <div className="mt-5 flex items-center gap-3">
              {socials.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-brand"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">
            Quick Links
          </h3>
          <ul className="space-y-2.5 text-sm">
            {[
              ["Home", "/"],
              ["About Us", "/about-us"],
              ["Products", "/products"],
              ["Gallery", "/#gallery"],
              ["Blog", "/blog"],
              ["Contact Us", "/contact-us"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="transition-colors hover:text-brand">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">
            Our Products
          </h3>
          <ul className="space-y-2.5 text-sm">
            {categories.length > 0 ? (
              categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/products?category=${cat.slug}`}
                    className="transition-colors hover:text-brand"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))
            ) : (
              <li>
                <Link href="/products" className="transition-colors hover:text-brand">
                  View All Products
                </Link>
              </li>
            )}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">
            Contact
          </h3>
          <ul className="space-y-3 text-sm">
            {settings?.address && (
              <li className="flex gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-brand" />
                <span>{settings.address}</span>
              </li>
            )}
            {settings?.phone && (
              <li className="flex gap-3">
                <Phone size={18} className="mt-0.5 shrink-0 text-brand" />
                <a href={`tel:${settings.phone}`}>{settings.phone}</a>
              </li>
            )}
            {settings?.email && (
              <li className="flex gap-3">
                <Mail size={18} className="mt-0.5 shrink-0 text-brand" />
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
              </li>
            )}
            {settings?.working_hours && (
              <li className="flex gap-3">
                <Clock size={18} className="mt-0.5 shrink-0 text-brand" />
                <span>{settings.working_hours}</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-px flex flex-col items-center justify-between gap-3 py-5 text-xs text-white/50 sm:flex-row">
          <p>
            &copy; {year} {settings?.company_name || "Perfect Industrial Solution"}. All
            Rights Reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-white">
              Privacy Policy
            </Link>
            <span className="text-white/20">|</span>
            <Link href="/terms-and-conditions" className="hover:text-white">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
