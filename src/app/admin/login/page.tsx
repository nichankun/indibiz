"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wifi, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"credentials" | "twofactor">("credentials");

  async function handleCredentialsSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Gagal masuk.");
        return;
      }

      if (data.requiresTwoFactor) {
        setStep("twofactor");
        return;
      }

      router.push("/admin");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function handleTwoFactorSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/auth/2fa/verify-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: form.get("code") }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Kode salah.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-navy-950)] px-6">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--primary)]">
            {step === "credentials" ? (
              <Wifi className="h-5 w-5 text-white" />
            ) : (
              <ShieldCheck className="h-5 w-5 text-white" />
            )}
          </div>
          <CardTitle>{step === "credentials" ? "Masuk ke Dashboard" : "Verifikasi 2FA"}</CardTitle>
          <CardDescription>
            {step === "credentials"
              ? "Khusus tim internal Indibiz"
              : "Masukkan kode 6 digit dari aplikasi authenticator Anda"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "credentials" ? (
            <form onSubmit={handleCredentialsSubmit} className="grid gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required autoComplete="username" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="password">Kata sandi</Label>
                <Input id="password" name="password" type="password" required autoComplete="current-password" />
              </div>

              {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

              <Button type="submit" disabled={loading} className="mt-1">
                {loading ? "Memproses..." : "Masuk"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleTwoFactorSubmit} className="grid gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="code">Kode 2FA</Label>
                <Input
                  id="code"
                  name="code"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required
                  autoFocus
                  placeholder="123456"
                  className="text-center text-lg tracking-[0.5em]"
                />
              </div>

              {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

              <Button type="submit" disabled={loading} className="mt-1">
                {loading ? "Memverifikasi..." : "Verifikasi"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
