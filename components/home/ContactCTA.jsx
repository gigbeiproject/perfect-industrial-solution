import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

export default function ContactCTA({ settings }) {
  return (
    <section className="bg-brand">
      <div className="container-px flex flex-col items-center justify-between gap-6 py-12 text-center md:flex-row md:text-left">
        <div>
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
            Need Industrial Products For Your Business?
          </h2>
          <p className="mt-2 text-sm text-white/85 md:text-base">
            Get in touch with our team for a customized quote and expert guidance.
          </p>
        </div>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          {settings?.phone && (
            <a
              href={`tel:${settings.phone}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-white"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15">
                <Phone size={18} />
              </span>
              {settings.phone}
            </a>
          )}
          <Link
            href="/contact-us"
            className="btn bg-ink text-white hover:bg-ink-2"
          >
            Get A Quote
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
