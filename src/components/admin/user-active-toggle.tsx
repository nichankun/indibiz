"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { toggleUserActive } from "@/app/admin/(dashboard)/users/actions";

type Props = {
  userId: number;
  isActive: boolean;
  disabled?: boolean;
  isSelf?: boolean;
};

export function UserActiveToggle({ userId, isActive, disabled, isSelf }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function performToggle() {
    startTransition(async () => {
      try {
        await toggleUserActive(userId, !isActive);
        toast.success(isActive ? "Akun dinonaktifkan" : "Akun diaktifkan");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Gagal mengubah status");
      }
    });
  }

  function handleClick() {
    if (isSelf && isActive) {
      toast.error("Anda tidak bisa menonaktifkan akun sendiri.");
      return;
    }

    if (isActive) {
      setConfirmOpen(true);
      return;
    }

    performToggle();
  }

  return (
    <>
      <Button
        size="sm"
        variant={isActive ? "outline" : "secondary"}
        onClick={handleClick}
        disabled={disabled || isPending}
      >
        {isActive ? "Nonaktifkan" : "Aktifkan"}
      </Button>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Nonaktifkan akun ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Akun tidak akan bisa login ke dashboard sampai diaktifkan kembali.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={performToggle}>Nonaktifkan</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}