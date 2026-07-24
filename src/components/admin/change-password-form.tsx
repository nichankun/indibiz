"use client";

import { useRef, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePassword } from "@/app/admin/(dashboard)/settings/actions";

export function ChangePasswordForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const current = String(form.get("currentPassword"));
    const next = String(form.get("newPassword"));
    const confirm = String(form.get("confirmPassword"));

    if (next !== confirm) {
      toast.error("Konfirmasi kata sandi baru tidak cocok");
      return;
    }

    startTransition(async () => {
      try {
        await changePassword(current, next);
        formRef.current?.reset();
        toast.success("Kata sandi berhasil diganti");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Gagal mengganti kata sandi");
      }
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="grid max-w-sm gap-4">
      <div className="grid gap-1.5">
        <Label htmlFor="currentPassword">Kata sandi saat ini</Label>
        <Input id="currentPassword" name="currentPassword" type="password" required autoComplete="current-password" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="newPassword">Kata sandi baru</Label>
        <Input id="newPassword" name="newPassword" type="password" required minLength={8} autoComplete="new-password" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="confirmPassword">Konfirmasi kata sandi baru</Label>
        <Input id="confirmPassword" name="confirmPassword" type="password" required minLength={8} autoComplete="new-password" />
      </div>
      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending ? "Menyimpan..." : "Ganti Kata Sandi"}
      </Button>
    </form>
  );
}
