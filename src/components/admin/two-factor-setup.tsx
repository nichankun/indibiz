"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, ShieldOff } from "lucide-react";
import {
  startTwoFactorSetup,
  confirmTwoFactorSetup,
  disableTwoFactor,
} from "@/app/admin/(dashboard)/settings/actions";

export function TwoFactorSetup({ initiallyEnabled }: { initiallyEnabled: boolean }) {
  const [enabled, setEnabled] = useState(initiallyEnabled);
  const [setupData, setSetupData] = useState<{ secret: string; qrDataUrl: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleStartSetup() {
    startTransition(async () => {
      try {
        const data = await startTwoFactorSetup();
        setSetupData(data);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Gagal memulai aktivasi 2FA");
      }
    });
  }

  function handleConfirm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const code = String(form.get("code"));

    startTransition(async () => {
      try {
        await confirmTwoFactorSetup(code);
        setEnabled(true);
        setSetupData(null);
        toast.success("2FA berhasil diaktifkan");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Kode tidak valid");
      }
    });
  }

  function handleDisable(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const password = String(form.get("password"));

    startTransition(async () => {
      try {
        await disableTwoFactor(password);
        setEnabled(false);
        toast.success("2FA dinonaktifkan");
        (e.target as HTMLFormElement).reset();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Gagal menonaktifkan 2FA");
      }
    });
  }

  if (enabled) {
    return (
      <div className="max-w-sm space-y-4">
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          <ShieldCheck className="h-4 w-4" />
          2FA aktif di akun Anda
        </div>
        <form onSubmit={handleDisable} className="grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="password">Kata sandi (untuk menonaktifkan)</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          <Button type="submit" variant="destructive" disabled={isPending} className="w-fit">
            <ShieldOff className="h-4 w-4" />
            {isPending ? "Memproses..." : "Nonaktifkan 2FA"}
          </Button>
        </form>
      </div>
    );
  }

  if (setupData) {
    return (
      <div className="max-w-sm space-y-4">
        <p className="text-sm text-muted-foreground">
          Pindai QR ini dengan aplikasi authenticator (Google Authenticator,
          Authy, dll), lalu masukkan kode 6 digit yang muncul.
        </p>
        <Image src={setupData.qrDataUrl} alt="QR Code 2FA" width={200} height={200} className="rounded-lg border border-border" unoptimized />
        <p className="break-all rounded-lg bg-secondary p-2 font-mono text-xs">
          Kode manual: {setupData.secret}
        </p>
        <form onSubmit={handleConfirm} className="grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="code">Kode konfirmasi</Label>
            <Input id="code" name="code" inputMode="numeric" maxLength={6} required placeholder="123456" />
          </div>
          <Button type="submit" disabled={isPending} className="w-fit">
            {isPending ? "Memverifikasi..." : "Aktifkan 2FA"}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-sm space-y-3">
      <p className="text-sm text-muted-foreground">
        Tambahkan lapisan keamanan ekstra dengan kode 6 digit dari aplikasi
        authenticator setiap kali login.
      </p>
      <Button onClick={handleStartSetup} disabled={isPending} className="w-fit">
        <ShieldCheck className="h-4 w-4" />
        {isPending ? "Memproses..." : "Aktifkan 2FA"}
      </Button>
    </div>
  );
}
