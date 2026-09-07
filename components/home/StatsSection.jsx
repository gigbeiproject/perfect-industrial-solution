import { Award, Boxes, Users, ShieldCheck, Headset } from "lucide-react";

const STATS = [
  { icon: Award, key: "years_experience", fallback: "20+", label: "Years Experience" },
  { icon: Boxes, value: "1000+", label: "Quality Products" },
  { icon: Users, value: "500+", label: "Satisfied Clients" },
  { icon: ShieldCheck, value: "100%", label: "Quality Assurance" },
  { icon: Headset, value: "24/7", label: "Customer Support" },
];

export default function StatsSection({ settings }) {
  return (
    <section
      className="relative section-py bg-ink text-white"
      style={{
        backgroundImage:
          "linear-gradient(rgba(12,17,29,0.92), rgba(12,17,29,0.92)), url('https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1920&auto=format&fit=crop')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container-px">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-extrabold sm:text-3xl md:text-4xl">
            Why <span className="text-brand">Choose Us</span>?
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            const value = stat.key ? settings?.[stat.key] || stat.fallback : stat.value;
            return (
              <div key={i} className="flex flex-col items-center text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/15 text-brand">
                  <Icon size={28} />
                </span>
                <span className="mt-4 text-2xl font-extrabold sm:text-3xl">{value}</span>
                <span className="mt-1 text-xs text-white/60 sm:text-sm">{stat.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
