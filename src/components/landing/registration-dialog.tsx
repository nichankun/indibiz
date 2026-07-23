"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packageId: number;
  packageName: string;
};

export function RegistrationDialog({ open, onOpenChange, packageId, packageName }: Props) {
  const searchParams = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [consentPrivacy, setConsentPrivacy] = useState(false);
  const [consentContact, setConsentContact] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!consentPrivacy) {
      toast.error("Anda perlu menyetujui kebijakan privasi terlebih dahulu.");
      return;
    }

    const form = new FormData(e.currentTarget);
    setSubmitting(true);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          whatsapp: form.get("whatsapp"),
          email: form.get("email") || undefined,
          city: form.get("city"),
          district: form.get("district"),
          postalCode: form.get("postalCode"),
          address: form.get("address"),
          packageId,
          consentPrivacy,
          consentContact,
          source: "landing_page",
          utmSource: searchParams.get("utm_source") ?? undefined,
          utmMedium: searchParams.get("utm_medium") ?? undefined,
          utmCampaign: searchParams.get("utm_campaign") ?? undefined,
          landingPageSource: typeof window !== "undefined" ? window.location.href : undefined,
          referral: document.referrer || undefined,
        }),
      });

      if (!res.ok) throw new Error("Gagal mengirim pendaftaran");

      toast.success("Pendaftaran diterima! Tim sales kami akan menghubungi Anda via WhatsApp.");
      onOpenChange(false);
      e.currentTarget.reset();
      setConsentPrivacy(false);
      setConsentContact(false);
    } catch {
      toast.error("Terjadi kesalahan. Silakan coba lagi atau hubungi CS via WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Daftar {packageName}</DialogTitle>
          <DialogDescription>
            Lengkapi data di bawah ini. Tim sales akan menghubungi Anda untuk
            validasi alamat dan jadwal survey.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="name">Nama lengkap</Label>
            <Input id="name" name="name" required placeholder="Nama sesuai KTP" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="whatsapp">Nomor WhatsApp</Label>
              <Input id="whatsapp" name="whatsapp" required placeholder="08xxxxxxxxxx" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="email">Email (opsional)</Label>
              <Input id="email" name="email" type="email" placeholder="nama@email.com" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="city">Kota/Kabupaten</Label>
              <Input id="city" name="city" required />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="district">Kecamatan</Label>
              <Input id="district" name="district" required />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="postalCode">Kode Pos</Label>
              <Input id="postalCode" name="postalCode" />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="address">Alamat lengkap</Label>
            <Textarea id="address" name="address" required placeholder="Jalan, nomor rumah, RT/RW, patokan" />
          </div>

          <div className="grid gap-2 rounded-lg border border-border bg-secondary p-3 text-sm">
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={consentPrivacy}
                onChange={(e) => setConsentPrivacy(e.target.checked)}
                className="mt-0.5"
              />
              <span>
                Saya menyetujui kebijakan privasi dan penggunaan data untuk
                proses pemasangan.
              </span>
            </label>
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={consentContact}
                onChange={(e) => setConsentContact(e.target.checked)}
                className="mt-0.5"
              />
              <span>Saya bersedia dihubungi via WhatsApp/telepon oleh tim Indibiz.</span>
            </label>
          </div>

          <DialogFooter>
            <Button type="submit" variant="accent" disabled={submitting}>
              {submitting ? "Mengirim..." : "Kirim Pendaftaran"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
