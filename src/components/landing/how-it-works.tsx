import { ListChecks, MessageCircle, PhoneCall, ClipboardList, MapPinCheck, Wrench } from "lucide-react";

const onlineSteps = [
  { icon: ListChecks, title: "Pilih paket", desc: "Bandingkan Basic dan Bisnis sesuai kebutuhan kecepatan usaha Anda." },
  { icon: MessageCircle, title: "Klik & chat WhatsApp", desc: "Klik paket yang diinginkan, Anda langsung terhubung ke WhatsApp dengan pesan yang sudah siap kirim." },
];

const fieldSteps = [
  { icon: PhoneCall, title: "Cek ketersediaan", desc: "Tim kami memastikan alamat Anda tercover jaringan Indibiz." },
  { icon: ClipboardList, title: "Registrasi", desc: "Data pelanggan dicatat dan didaftarkan ke sistem kami." },
  { icon: MapPinCheck, title: "Jadwalkan survey", desc: "Menyepakati jadwal survey lokasi dan pemasangan bersama Anda." },
  { icon: Wrench, title: "Pemasangan", desc: "Instalasi oleh teknisi, internet siap digunakan." },
];

function StepGroup({
  label,
  steps,
  startIndex,
}: {
  label: string;
  steps: typeof onlineSteps;
  startIndex: number;
}) {
  return (
    <div>
      <span className="text-xs font-semibold uppercase tracking-wider text-brand-blue">
        {label}
      </span>
      <ol className="mt-4 space-y-0">
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          return (
            <li key={step.title} className="relative flex gap-4 pb-8 last:pb-0">
              {!isLast && (
                <span
                  aria-hidden
                  className="absolute left-5 top-10 h-full w-px bg-border"
                />
              )}
              <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-blue text-sm font-semibold text-white shadow-md shadow-brand-blue/30">
                {String(startIndex + i).padStart(2, "0")}
              </div>

              <div className="pt-1.5">
                <div className="flex items-center gap-2">
                  <step.icon className="h-4 w-4 text-brand-blue" />
                  <h3 className="font-semibold text-foreground">{step.title}</h3>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{step.desc}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section className="bg-brand-ice py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-brand-blue">
            Alur Pendaftaran
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
            Dari klik sampai internet menyala
          </h2>
          <p className="mt-3 text-muted-foreground sm:text-lg">
            Enam langkah sederhana, tanpa proses berbelit — tim kami yang
            urus sisanya.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl gap-10 rounded-3xl border border-border bg-background p-8 shadow-sm sm:grid-cols-2 sm:p-12">
          <StepGroup label="Yang Anda lakukan" steps={onlineSteps} startIndex={1} />
          <StepGroup label="Yang Admin lakukan" steps={fieldSteps} startIndex={3} />
        </div>
      </div>
    </section>
  );
}