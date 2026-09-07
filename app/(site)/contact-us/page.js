import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { getCompanySettings } from "@/lib/settings";
import PageHeader from "@/components/ui/PageHeader";
import ContactForm from "@/components/home/ContactForm";

export async function generateMetadata() {
  const settings = await getCompanySettings();
  return {
    title: "Contact Us",
    description: `Get in touch with ${settings.company_name} for product inquiries and support.`,
  };
}

export default async function ContactUsPage() {
  const settings = await getCompanySettings();

  const infoItems = [
    { icon: MapPin, label: "Address", value: settings.address },
    { icon: Phone, label: "Phone", value: settings.phone, href: `tel:${settings.phone}` },
    { icon: Mail, label: "Email", value: settings.email, href: `mailto:${settings.email}` },
    { icon: Clock, label: "Working Hours", value: settings.working_hours },
  ].filter((item) => item.value);

  return (
    <>
      <PageHeader title="Contact Us" crumbs={[{ label: "Contact Us" }]} />

      <section className="section-py bg-white">
        <div className="container-px grid grid-cols-1 gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <p className="eyebrow mb-2">Get In Touch</p>
            <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">
              We&apos;d Love To Hear From You
            </h2>
            <p className="mt-3 text-sm text-muted">
              Reach out with your requirements and our team will respond promptly.
            </p>

            <div className="mt-8 space-y-5">
              {infoItems.map((item) => {
                const Icon = item.icon;
                const content = item.href ? (
                  <a href={item.href} className="font-semibold text-ink hover:text-brand">
                    {item.value}
                  </a>
                ) : (
                  <p className="font-semibold text-ink">{item.value}</p>
                );
                return (
                  <div key={item.label} className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-light text-brand">
                      <Icon size={20} />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted">{item.label}</p>
                      {content}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-sm border border-border-muted bg-white p-6 card-shadow lg:col-span-3 md:p-8">
            <ContactForm />
          </div>
        </div>

        {settings.google_maps_url && (
          <div className="container-px mt-14">
            <div className="aspect-[16/6] w-full overflow-hidden rounded-sm border border-border-muted">
              <iframe
                src={settings.google_maps_url}
                title="Location Map"
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        )}
      </section>
    </>
  );
}
