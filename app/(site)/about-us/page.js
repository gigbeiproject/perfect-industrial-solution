import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { query, queryOne } from "@/lib/db";
import { getCompanySettings } from "@/lib/settings";
import PageHeader from "@/components/ui/PageHeader";
import StatsSection from "@/components/home/StatsSection";
import { resolveIcon } from "@/lib/icon-map";

export async function generateMetadata() {
  const settings = await getCompanySettings();
  return {
    title: "About Us",
    description: `Learn more about ${settings.company_name}, a provider of industrial products and services.`,
  };
}

export default async function AboutUsPage() {
  const [about, features, settings] = await Promise.all([
    queryOne("SELECT * FROM about_sections ORDER BY id ASC LIMIT 1"),
    query("SELECT * FROM about_features WHERE status = 1 ORDER BY sort_order ASC, id ASC"),
    getCompanySettings(),
  ]);

  return (
    <>
      <PageHeader title="About Us" crumbs={[{ label: "About Us" }]} />

      <section className="section-py bg-white">
        <div className="container-px grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm card-shadow">
            {about?.image_url ? (
              <Image
                src={about.image_url}
                alt={about.heading}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            ) : (
              <Image
                src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1200&auto=format&fit=crop"
                alt={about?.heading || "Perfect Industrial Solution"}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            )}
          </div>
          <div>
            {about?.label && <p className="eyebrow mb-3">{about.label}</p>}
            <h2 className="text-2xl font-extrabold leading-tight text-ink sm:text-3xl md:text-4xl">
              {about?.heading || `About ${settings.company_name}`}
            </h2>
            {about?.description && (
              <p className="mt-5 text-sm leading-relaxed text-muted md:text-base">
                {about.description}
              </p>
            )}
            <Link href="/contact-us" className="btn-primary mt-7">
              Contact Us
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {features.length > 0 && (
        <section className="section-py bg-surface">
          <div className="container-px">
            <div className="mx-auto max-w-xl text-center">
              <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">
                Why Industries <span className="text-brand">Choose Us</span>
              </h2>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => {
                const Icon = resolveIcon(feature.icon);
                return (
                  <div
                    key={feature.id}
                    className="card-shadow rounded-sm border border-border-muted bg-white p-6 text-center"
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
        </section>
      )}

      <StatsSection settings={settings} />
    </>
  );
}
