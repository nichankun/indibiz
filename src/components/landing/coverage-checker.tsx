"use client";

import { useState } from "react";
import { MapPin, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function CoverageChecker() {
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<"idle" | "submitted" | "error">("idle");
  const [consent, setConsent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setChecking(true);
    setResult("idle");

    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          whatsapp: form.get("whatsapp"),
          city: form.get("city"),
          address: form.get("address"),
          source: "coverage_checker",
          consentPrivacy: consent,
          consentContact: consent,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setResult("submitted");
    } catch {
      setResult("error");
    } finally {
      setChecking(false);
    }
  }

  return (
    <section id="cek-jangkauan" className="mx-auto max-w-4xl px-6 py-20">
      <div className="grid overflow-hidden rounded-3xl border border-border bg-card text-card-foreground shadow-sm sm:grid-cols-5">
        {/* Panel kiri: konteks & value prop */}
        <div className="flex flex-col justify-between bg-primary p-8 text-primary-foreground sm:col-span-2 sm:p-10">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-medium">
              <MapPin className="h-3.5 w-3.5" /> Cek jangkauan area
            </span>
            <h2 className="mt-4 text-2xl font-semibold leading-snug">
              Alamat Anda terjangkau IndiBiz?
            </h2>
            <p className="mt-2 text-sm text-primary-foreground/80">
              Masukkan alamat Anda, tim kami akan mengecek jangkauan
              jaringan dan menghubungi Anda dalam 1x24 jam kerja.
            </p>
          </div>
          <p className="mt-8 text-xs text-primary-foreground/60">
            Data Anda hanya digunakan untuk proses pengecekan dan
            dihubungi oleh tim IndiBiz.
          </p>
        </div>

        {/* Panel kanan: form */}
        <div className="p-8 sm:col-span-3 sm:p-10">
          {result === "submitted" ? (
            <div className="flex h-full flex-col items-start justify-center gap-2 rounded-xl bg-muted p-4 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Terima kasih!</p>
              <p>
                Alamat Anda sudah masuk antrean pengecekan. Tim kami akan
                menghubungi Anda via WhatsApp.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="cc-name">Nama</Label>
                  <Input id="cc-name" name="name" required disabled={checking} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cc-whatsapp">Nomor WhatsApp</Label>
                  <Input id="cc-whatsapp" name="whatsapp" required disabled={checking} />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cc-city">Kota/Kabupaten</Label>
                <Input id="cc-city" name="city" required disabled={checking} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cc-address">Alamat lengkap</Label>
                <Textarea
                  id="cc-address"
                  name="address"
                  required
                  disabled={checking}
                  rows={3}
                  placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan"
                />
              </div>

              <div className="flex items-start gap-2 pt-1">
                <Checkbox
                  id="cc-consent"
                  checked={consent}
                  onCheckedChange={(v) => setConsent(v === true)}
                  disabled={checking}
                />
                <Label htmlFor="cc-consent" className="text-xs font-normal text-muted-foreground">
                  Saya setuju data ini digunakan untuk pengecekan jangkauan
                  dan dihubungi oleh tim IndiBiz.
                </Label>
              </div>

              {result === "error" && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  Gagal mengirim data. Silakan coba lagi.
                </div>
              )}

              <Button type="submit" disabled={checking || !consent} className="mt-1">
                {checking ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <MapPin className="mr-2 h-4 w-4" />
                )}
                {checking ? "Mengecek..." : "Cek jangkauan"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}