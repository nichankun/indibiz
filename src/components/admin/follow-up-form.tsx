"use client";

import { useRef, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addFollowUpNote } from "@/app/admin/(dashboard)/leads/actions";

export function FollowUpForm({ leadId }: { leadId: number }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const content = String(form.get("content") ?? "").trim();
    const nextFollowUpDate = String(form.get("nextFollowUpDate") ?? "");

    if (!content) return;

    startTransition(async () => {
      try {
        await addFollowUpNote(leadId, content, nextFollowUpDate || undefined);
        formRef.current?.reset();
        toast.success("Catatan follow-up ditambahkan");
      } catch {
        toast.error("Gagal menambahkan catatan");
      }
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="grid gap-3">
      <div className="grid gap-1.5">
        <Label htmlFor="content">Catatan follow-up</Label>
        <Textarea id="content" name="content" required placeholder="Hasil komunikasi terakhir dengan pelanggan..." />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="nextFollowUpDate">Reminder follow-up berikutnya (opsional)</Label>
        <Input id="nextFollowUpDate" name="nextFollowUpDate" type="date" />
      </div>
      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending ? "Menyimpan..." : "Simpan Catatan"}
      </Button>
    </form>
  );
}
