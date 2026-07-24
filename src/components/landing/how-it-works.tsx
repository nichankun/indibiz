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
    <section className="bg-secondary py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          {/* Label atas (Eyebrow) */}
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Alur Pendaftaran
          </span>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl text-foreground">
            Dari klik sampai internet menyala
          </h2>
        </div>

        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, i) => (
            /* Card Background */
            <li 
              key={step.title} 
              className="relative flex gap-4 rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm"
            >
              {/* Nomor Lingkaran */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {String(i + 1).padStart(2, "0")}
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  {/* Ikon */}
                  <step.icon className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold">{step.title}</h3>
                </div>
                {/* Deskripsi */}
                <p className="mt-1 text-sm text-muted-foreground">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}