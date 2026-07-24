"use client";

import { useState } from "react";
import { Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRupiah } from "@/lib/utils";
import { RegistrationDialog } from "./registration-dialog";
import type { Package } from "@/db/database/schema";

type Props = {
  basicPackages: Package[];
  bisnisPackages: Package[];
};

export function PackagesSection({ basicPackages, bisnisPackages }: Props) {
  const [category, setCategory] = useState<"basic" | "bisnis">("basic");
  const [selected, setSelected] = useState<Package | null>(null);

  const activePackages = category === "basic" ? basicPackages : bisnisPackages;

  return (
    <section id="paket" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        {/* PERBAIKAN: text-accent -> text-primary */}
        <span className="text-sm font-semibold uppercase tracking-wider text-primary">
          Paket &amp; Harga
        </span>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Satu koneksi, dua pilihan kebutuhan
        </h2>
        <p className="mt-3 text-muted-foreground">
          Basic untuk rumah dan usaha kecil. Bisnis untuk yang butuh IP publik
          dan SLA garansi gangguan.
        </p>
      </div>

      {/* PERBAIKAN: Gaya toggle disesuaikan dengan komponen Tabs Shadcn */}
      <div className="mx-auto mt-8 flex w-fit rounded-full bg-muted p-1 text-muted-foreground">
        {(["basic", "bisnis"] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`rounded-full px-6 py-2 text-sm font-medium capitalize transition-all ${
              category === cat
                ? "bg-background text-foreground shadow-sm"
                : "hover:bg-background/50 hover:text-foreground"
            }`}
          >
            {cat === "basic" ? "Basic" : "Bisnis"}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {activePackages.map((pkg) => {
          const discount =
            pkg.promoPrice && Number(pkg.normalPrice) > 0
              ? Math.round((1 - Number(pkg.promoPrice) / Number(pkg.normalPrice)) * 100)
              : 0;

          return (
            <Card
              key={pkg.id}
              // PERBAIKAN: border-accent -> border-primary
              className={`relative flex flex-col gap-4 p-6 ${
                pkg.badge ? "border-2 border-primary shadow-md" : ""
              }`}
            >
              {pkg.badge && (
                // PERBAIKAN: variant="accent" dihapus (menggunakan default primary)
                <Badge className="absolute -top-3 left-6">
                  {pkg.badge}
                </Badge>
              )}

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-foreground">
                  {pkg.speedMbps}
                </span>
                <span className="text-sm text-muted-foreground">Mbps</span>
              </div>

              <div>
                {pkg.promoPrice && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground line-through">
                      {formatRupiah(pkg.normalPrice)}
                    </span>
                    {discount > 0 && (
                      // PERBAIKAN: bg-accent -> bg-primary
                      <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs font-semibold text-primary">
                        -{discount}%
                      </span>
                    )}
                  </div>
                )}
                <div className="text-2xl font-bold text-primary">
                  {formatRupiah(pkg.promoPrice ?? pkg.normalPrice)}
                  <span className="text-sm font-normal text-muted-foreground"> /bulan</span>
                </div>
              </div>

              <ul className="flex flex-1 flex-col gap-2 text-sm text-muted-foreground">
                {(pkg.benefits ?? []).map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2">
                    {/* PERBAIKAN: text-emerald-600 -> text-primary untuk konsistensi tema */}
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>

              {/* PERBAIKAN: mt-auto agar tombol sejajar di bawah, variant menyesuaikan status unggulan, margin ikon ditambah */}
              <Button 
                variant={pkg.badge ? "default" : "outline"} 
                onClick={() => setSelected(pkg)}
                className="mt-auto"
              >
                <Zap className="mr-2 h-4 w-4" />
                Daftar Sekarang
              </Button>
            </Card>
          );
        })}
      </div>

      {selected && (
        <RegistrationDialog
          open={!!selected}
          onOpenChange={(open) => !open && setSelected(null)}
          packageId={selected.id}
          packageName={selected.name}
        />
      )}
    </section>
  );
}