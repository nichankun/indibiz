"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePackagePricing } from "@/app/admin/(dashboard)/packages/actions";
import type { Package } from "@/db/database/schema";

export function PackageEditDialog({ pkg }: { pkg: Package }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await updatePackagePricing(pkg.id, {
          normalPrice: Number(form.get("normalPrice")),
          promoPrice: form.get("promoPrice") ? Number(form.get("promoPrice")) : undefined,
          isActive: form.get("isActive") === "on",
          badge: String(form.get("badge") ?? ""),
        });
        toast.success("Paket diperbarui");
        setOpen(false);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Gagal memperbarui paket");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {pkg.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="normalPrice">Harga normal (Rp)</Label>
              <Input id="normalPrice" name="normalPrice" type="number" defaultValue={pkg.normalPrice} required />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="promoPrice">Harga promo (Rp)</Label>
              <Input id="promoPrice" name="promoPrice" type="number" defaultValue={pkg.promoPrice ?? ""} />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="badge">Badge (opsional)</Label>
            <Input id="badge" name="badge" defaultValue={pkg.badge ?? ""} placeholder="Paling Populer" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isActive" defaultChecked={pkg.isActive} />
            Tampilkan di landing page
          </label>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}