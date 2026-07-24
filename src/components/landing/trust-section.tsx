import { Users, MapPin, Headset } from "lucide-react";

const stats = [
  {
    icon: Users,
    label: "Pelanggan terpasang",
    value: "10.000+",
  },
  {
    icon: MapPin,
    label: "Area layanan",
    value: "Yogyakarta & sekitarnya",
  },
  {
    icon: Headset,
    label: "Dukungan teknis",
    value: "24/7",
  },
];

export function TrustSection() {
  return (
    <section className="relative border-y border-border bg-background py-14 text-foreground">
      {/* Aksen garis tipis di tengah, sebagai jangkar visual */}
      <div
        aria-hidden
        className="absolute left-1/2 top-0 h-px w-24 -translate-x-1/2 bg-linear-to-r from-transparent via-primary to-transparent"
      />

      <div className="mx-auto max-w-6xl px-6">
        <div className="grid divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group flex items-center gap-4 py-6 transition-colors sm:justify-center sm:px-8 sm:py-2"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20 transition-colors group-hover:bg-primary/15">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-xl font-semibold tracking-tight">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}