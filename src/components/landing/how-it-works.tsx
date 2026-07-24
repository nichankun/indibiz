import { FileSearch, ListChecks, MapPinCheck, Send, PhoneCall, Wrench } from "lucide-react";

const onlineSteps = [
  { icon: ListChecks, title: "Pilih paket", desc: "Bandingkan Basic dan Bisnis sesuai kebutuhan kecepatan." },
  { icon: FileSearch, title: "Isi data", desc: "Lengkapi data diri dan alamat pemasangan." },
  { icon: MapPinCheck, title: "Validasi alamat", desc: "Tim kami memastikan lokasi Anda tercover jaringan." },
  { icon: Send, title: "Submit", desc: "Pendaftaran masuk ke sistem, Anda dapat nomor lead." },
];

const fieldSteps = [
  { icon: PhoneCall, title: "Konfirmasi", desc: "Sales menghubungi via WhatsApp untuk jadwal survey." },
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
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <ol className="mt-4 space-y-0">
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          return (
            <li key={step.title} className="relative flex gap-4 pb-8 last:pb-0">
              {/* Garis penghubung */}
              {!isLast && (
                <span
                  aria-hidden
                  className="absolute left-5 top-10 h-full w-px bg-border"
                />
              )}
              {/* Lingkaran nomor */}
              <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {String(startIndex + i).padStart(2, "0")}
              </div>

              <div className="pt-1.5">
                <div className="flex items-center gap-2">
                  <step.icon className="h-4 w-4 text-primary" />
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
    <section className="bg-secondary py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Alur Pendaftaran
          </span>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Dari klik sampai internet menyala
          </h2>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl gap-10 sm:grid-cols-2">
          <StepGroup label="Yang Anda lakukan" steps={onlineSteps} startIndex={1} />
          <StepGroup label="Yang kami lakukan" steps={fieldSteps} startIndex={5} />
        </div>
      </div>
    </section>
  );
}