import Image from "next/image";

export function TrustSection() {
  return (
    <section className="relative border-y border-border bg-background pb-16 pt-0 sm:pb-20 sm:pt-0 text-foreground overflow-hidden">
      <div className="mx-auto max-w-2xl px-6 text-center">
        {/* Ikon peta Indonesia */}
        <Image
          src="/peta.png"
          alt="Peta Indonesia"
          width={900}
          height={320}
          className="relative z-0 -mt-16 mx-auto h-120 w-auto sm:-mt-24 sm:h-150"
          priority
        />

        {/* Judul */}
        <h2 className="relative z-10 -mt-10 text-3xl font-bold leading-tight tracking-tight sm:-mt-30 sm:text-4xl">
          Jaringan Fiber Optic Terluas
          <br />
          Se-Indonesia
        </h2>

        {/* Subjudul */}
        <p className="relative z-10 mt-4 text-base text-muted-foreground sm:text-lg">
          Indibiz menyediakan jaringan internet cepat dan stabil yang
          menjangkau seluruh wilayah Indonesia
        </p>
      </div>
    </section>
  );
}