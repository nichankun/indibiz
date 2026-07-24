"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { LocationPicker } from "./location-picker";

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
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

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
          latitude: location?.lat,
          longitude: location?.lng,
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
      setLocation(null);
    } catch {
      toast.error("Terjadi kesalahan. Silakan coba lagi atau hubungi CS via WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">Daftar internet bisnis</DialogTitle>
          <DialogDescription>
            Lengkapi data di bawah ini. Tim sales akan menghubungi Anda untuk
            validasi alamat dan jadwal survey.
          </DialogDescription>
        </DialogHeader>

        {/* Chip paket yang dipilih */}
        <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-sm">
          <span className="text-muted-foreground">Paket dipilih:</span>
          <span className="font-medium text-primary">{packageName}</span>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6">
          {/* Data diri */}
          <div className="grid gap-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Data diri
            </span>
            <div className="grid gap-1.5">
              <Label htmlFor="name">Nama lengkap</Label>
              <Input id="name" name="name" required placeholder="Nama sesuai KTP" disabled={submitting} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="whatsapp">Nomor WhatsApp</Label>
                <Input id="whatsapp" name="whatsapp" required placeholder="08xxxxxxxxxx" disabled={submitting} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="email">Email (opsional)</Label>
                <Input id="email" name="email" type="email" placeholder="nama@email.com" disabled={submitting} />
              </div>
            </div>
          </div>

          {/* Lokasi pemasangan */}
          <div className="grid gap-4 border-t border-border pt-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Lokasi pemasangan
            </span>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="grid gap-1.5">
                <Label htmlFor="city">Kota/Kabupaten</Label>
                <Input id="city" name="city" required disabled={submitting} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="district">Kecamatan</Label>
                <Input id="district" name="district" required disabled={submitting} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="postalCode">Kode pos</Label>
                <Input id="postalCode" name="postalCode" disabled={submitting} />
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="address">Alamat lengkap</Label>
              <Textarea
                id="address"
                name="address"
                required
                placeholder="Jalan, nomor rumah, RT/RW, patokan"
                disabled={submitting}
              />
            </div>

            <LocationPicker value={location} onChange={setLocation} />
          </div>

          {/* Persetujuan */}
          <div className="grid gap-3 rounded-lg border border-border bg-muted/50 p-4">
            <div className="flex items-start gap-2">
              <Checkbox
                id="consent-privacy"
                checked={consentPrivacy}
                onCheckedChange={(v) => setConsentPrivacy(v === true)}
                disabled={submitting}
              />
              <Label htmlFor="consent-privacy" className="text-sm font-normal leading-snug">
                Saya menyetujui kebijakan privasi dan penggunaan data untuk
                proses pemasangan.
              </Label>
            </div>
            <div className="flex items-start gap-2">
              <Checkbox
                id="consent-contact"
                checked={consentContact}
                onCheckedChange={(v) => setConsentContact(v === true)}
                disabled={submitting}
              />
              <Label htmlFor="consent-contact" className="text-sm font-normal leading-snug">
                Saya bersedia dihubungi via WhatsApp/telepon oleh tim IndiBiz.
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {submitting ? "Mengirim..." : "Kirim pendaftaran"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}