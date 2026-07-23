import { FileSearch, ListChecks, MapPinCheck, Send, PhoneCall, Wrench } from "lucide-react";

const steps = [
  { icon: ListChecks, title: "Pilih Paket", desc: "Bandingkan Basic dan Bisnis sesuai kebutuhan kecepatan." },
  { icon: FileSearch, title: "Isi Data", desc: "Lengkapi data diri dan alamat pemasangan." },
  { icon: MapPinCheck, title: "Validasi Alamat", desc: "Tim kami memastikan lokasi Anda tercover jaringan." },
  { icon: Send, title: "Submit", desc: "Pendaftaran masuk ke sistem, Anda dapat nomor lead." },
  { icon: PhoneCall, title: "Konfirmasi", desc: "Sales menghubungi via WhatsApp untuk jadwal survey." },
  { icon: Wrench, title: "Pemasangan", desc: "Instalasi oleh teknisi, internet siap digunakan." },
];

export function HowItWorks() {
  return (
    <section className="bg-[var(--secondary)] py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-[var(--accent)]">Alur Pendaftaran</span>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight sm:text-4xl">
            Dari klik sampai internet menyala
          </h2>
        </div>

        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step.title} className="relative flex gap-4 rounded-2xl border border-[var(--border)] bg-white p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] font-[family-name:var(--font-display)] text-sm font-semibold text-white">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <step.icon className="h-4 w-4 text-[var(--accent)]" />
                  <h3 className="font-semibold">{step.title}</h3>
                </div>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
