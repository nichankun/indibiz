"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { MessageSquareText } from "lucide-react";
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
import { sendLeadWhatsAppTemplate } from "@/app/admin/(dashboard)/leads/actions";

export function WhatsappTemplateDialog({ leadId, leadName }: { leadId: number; leadName: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const templateName = String(form.get("templateName"));
    const param1 = String(form.get("param1") ?? "");
    const param2 = String(form.get("param2") ?? "");

    startTransition(async () => {
      try {
        await sendLeadWhatsAppTemplate(leadId, templateName, [param1, param2].filter(Boolean));
        toast.success("Template WhatsApp terkirim");
        setOpen(false);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Gagal mengirim pesan");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <MessageSquareText className="h-4 w-4" />
        Kirim Template WA
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kirim Template WhatsApp ke {leadName}</DialogTitle>
          <DialogDescription>
            Nama template harus sudah disetujui di WhatsApp Manager Anda.
            Parameter diisi sesuai urutan variabel di template ({"{{1}}"}, {"{{2}}"}, ...).
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="templateName">Nama template</Label>
            <Input id="templateName" name="templateName" required placeholder="konfirmasi_pendaftaran" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="param1">Parameter 1 (opsional)</Label>
            <Input id="param1" name="param1" placeholder={leadName} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="param2">Parameter 2 (opsional)</Label>
            <Input id="param2" name="param2" />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Mengirim..." : "Kirim"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
