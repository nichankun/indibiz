import { CheckCircle2, MessageCircle, PackageCheck } from "lucide-react";

const steps = [
  {
    icon: PackageCheck,
    number: "01",
    title: "Pilih paket",
    description: "Bandingkan kecepatan dan layanan pendukung yang sesuai kebutuhan usaha.",
  },
  {
    icon: MessageCircle,
    number: "02",
    title: "Chat admin sales",
    description: "Tombol konsultasi membuka WhatsApp admin dengan pertanyaan paket yang sudah disiapkan.",
  },
  {
    icon: CheckCircle2,
    number: "03",
    title: "Konfirmasi ketersediaan",
    description: "Sampaikan lokasi usaha di chat agar admin dapat membantu mengecek jaringan dan proses berikutnya.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-white px-5 py-10 sm:px-6 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <h2 className="font-display text-[1.7rem] leading-[1.22] font-semibold tracking-[-0.025em] text-brand-navy sm:text-3xl lg:text-4xl lg:leading-tight">
            Konsultasi tanpa formulir yang rumit
          </h2>
        </div>

        <ol className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-3 sm:gap-4 lg:mt-10 lg:gap-5">
          {steps.map(({ icon: Icon, number, title, description }) => (
            <li key={number} className="rounded-2xl border border-border bg-slate-50 p-4 sm:p-6 lg:rounded-3xl lg:p-7">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-ice text-brand-blue lg:h-12 lg:w-12 lg:rounded-2xl">
                  <Icon className="h-5 w-5 lg:h-6 lg:w-6" />
                </span>
                <span className="text-sm font-semibold tracking-widest text-slate-300">{number}</span>
              </div>
              <h3 className="mt-4 font-semibold text-brand-navy lg:text-lg">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground lg:text-base lg:leading-7">{description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
