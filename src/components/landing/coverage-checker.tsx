"use client";

import { useState } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CoverageChecker() {
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<"idle" | "submitted">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setChecking(true);

    // Catatan: pengecekan area otomatis (mis. berbasis peta ODP) belum
    // terhubung ke data jaringan riil. Untuk saat ini alamat dikirim sebagai
    // permintaan pengecekan manual ke tim sales — lihat POST /api/leads
    // dengan source "coverage_checker".
    const form = new FormData(e.currentTarget);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          whatsapp: form.get("whatsapp"),
          city: form.get("city"),
          address: form.get("address"),
          source: "coverage_checker",
          consentPrivacy: true,
          consentContact: true,
        }),
      });
      setResult("submitted");
    } finally {
      setChecking(false);
    }
  }

  return (
    <section id="cek-jangkauan" className="mx-auto max-w-4xl px-6 py-20">
      <div className="rounded-3xl border border-border bg-card p-8 text-card-foreground shadow-sm sm:p-12">
        
        {/* Badge */}
        <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
          <MapPin className="h-3.5 w-3.5" /> Cek Jangkauan Area
        </span>
        
        {/* Heading */}
        <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">
          Alamat Anda terjangkau Indibiz?
        </h2>
        
        {/* Deskripsi */}
        <p className="mt-2 max-w-lg text-sm text-muted-foreground">
          Masukkan alamat Anda, tim kami akan mengecek jangkauan jaringan dan
          menghubungi Anda dalam 1x24 jam kerja.
        </p>

        {/* State Berhasil */}
        {result === "submitted" ? (
          <div className="mt-6 rounded-xl bg-muted p-4 text-sm text-muted-foreground">
            Terima kasih! Alamat Anda sudah masuk antrean pengecekan. Tim
            kami akan menghubungi Anda via WhatsApp.
          </div>
        ) : (
          /* Form Inputs */
          <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="cc-name">Nama</Label>
              <Input id="cc-name" name="name" required />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="cc-whatsapp">Nomor WhatsApp</Label>
              <Input id="cc-whatsapp" name="whatsapp" required />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="cc-city">Kota/Kabupaten</Label>
              <Input id="cc-city" name="city" required />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="cc-address">Alamat lengkap</Label>
              <Input id="cc-address" name="address" required />
            </div>
            
            {/* Tombol Aksi */}
            <Button type="submit" disabled={checking} className="mt-2 sm:col-span-2">
              {checking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MapPin className="mr-2 h-4 w-4" />}
              {checking ? "Mengecek..." : "Cek Jangkauan"}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}