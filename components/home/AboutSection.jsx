import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { resolveIcon } from "@/lib/icon-map";

export default function AboutSection({ about, features }) {
  if (!about) return null;

  return (
    <section className="section-py bg-white">
      <div className="container-px">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            {about.label && <p className="eyebrow mb-3">{about.label}</p>}
            <h2 className="text-2xl font-extrabold leading-tight text-ink sm:text-3xl md:text-4xl">
              {about.heading}
            </h2>
            {about.description && (
              <p className="mt-5 text-sm leading-relaxed text-muted md:text-base">
                {about.description}
              </p>
            )}
            {about.cta_text && about.cta_link && (
              <Link href={about.cta_link} className="btn-primary mt-7">
                {about.cta_text}
                <ChevronRight size={16} />
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {features.map((feature) => {
              const Icon = resolveIcon(feature.icon);
              return (
                <div
                  key={feature.id}
                  className="card-shadow rounded-sm border border-border-muted bg-white p-6 text-center transition-transform duration-200 hover:-translate-y-1"
                >
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-light text-brand">
                    <Icon size={26} />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-ink">{feature.title}</h3>
                  {feature.description && (
                    <p className="mt-2 text-xs leading-relaxed text-muted">
                      {feature.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
