"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { toggleUserActive } from "@/app/admin/(dashboard)/users/actions";

export function UserActiveToggle({ userId, isActive, disabled }: { userId: number; isActive: boolean; disabled?: boolean }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      try {
        await toggleUserActive(userId, !isActive);
        toast.success(isActive ? "Akun dinonaktifkan" : "Akun diaktifkan");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Gagal mengubah status");
      }
    });
  }

  return (
    <Button
      size="sm"
      variant={isActive ? "outline" : "secondary"}
      onClick={handleClick}
      disabled={disabled || isPending}
    >
      {isActive ? "Nonaktifkan" : "Aktifkan"}
    </Button>
  );
}
