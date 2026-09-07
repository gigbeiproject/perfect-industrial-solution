import Image from "next/image";

export default function TrustedClients({ clients }) {
  if (!clients || clients.length === 0) return null;

  return (
    <section className="border-t border-border-muted bg-white py-12">
      <div className="container-px">
        <h2 className="text-center text-lg font-extrabold text-ink sm:text-xl">
          Our <span className="text-brand">Trusted Clients</span>
        </h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {clients.map((client) =>
            client.website ? (
              <a
                key={client.id}
                href={client.website}
                target="_blank"
                rel="noopener noreferrer"
                className="relative h-10 w-28 grayscale transition-all hover:grayscale-0"
              >
                <Image
                  src={client.logo_url}
                  alt={client.company_name}
                  fill
                  className="object-contain"
                />
              </a>
            ) : (
              <div
                key={client.id}
                className="relative h-10 w-28 grayscale transition-all hover:grayscale-0"
              >
                <Image
                  src={client.logo_url}
                  alt={client.company_name}
                  fill
                  className="object-contain"
                />
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
