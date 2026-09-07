import Image from "next/image";
import { Star, Quote, User } from "lucide-react";

export default function TestimonialsSection({ testimonials }) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="section-py bg-surface">
      <div className="container-px">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-extrabold text-ink sm:text-3xl md:text-4xl">
            What Our <span className="text-brand">Clients Say</span>
          </h2>
          <p className="mt-3 text-sm text-muted">
            Trusted by industries, recommended by clients
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="flex flex-col rounded-sm border border-border-muted bg-white p-6 card-shadow"
            >
              <Quote className="text-brand/30" size={30} />
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{t.review}</p>
              <div className="mt-5 flex items-center gap-1 text-brand">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < t.rating ? "currentColor" : "none"}
                    className={i < t.rating ? "" : "text-border-muted"}
                  />
                ))}
              </div>
              <div className="mt-4 flex items-center gap-3 border-t border-border-muted pt-4">
                {t.photo_url ? (
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
                    <Image src={t.photo_url} alt={t.customer_name} fill className="object-cover" />
                  </div>
                ) : (
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-light text-brand">
                    <User size={20} />
                  </span>
                )}
                <div>
                  <p className="text-sm font-bold text-ink">{t.customer_name}</p>
                  <p className="text-xs text-muted">
                    {[t.designation, t.company].filter(Boolean).join(", ")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
