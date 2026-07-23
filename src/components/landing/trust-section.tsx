import { Users, MapPin, Headset } from "lucide-react";

const stats = [
  { icon: Users, label: "Pelanggan terpasang", value: "10.000+" },
  { icon: MapPin, label: "Area layanan", value: "Sulawesi & sekitarnya" },
  { icon: Headset, label: "Dukungan teknis", value: "24/7" },
];

export function TrustSection() {
  return (
    <section className="border-y border-border bg-white py-12">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary">
              <stat.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-(family-name:--font-display) text-xl font-semibold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
