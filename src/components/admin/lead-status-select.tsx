"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LEAD_STATUS_LABEL, LEAD_STATUS_ORDER } from "@/lib/utils";
import { updateLeadStatus } from "@/app/admin/(dashboard)/leads/actions";

export function LeadStatusSelect({ leadId, status }: { leadId: number; status: string }) {
  const [current, setCurrent] = useState(status);
  const [pendingValue, setPendingValue] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [isPending, startTransition] = useTransition();

  function commitChange(value: string, rejectionReason?: string) {
    const previous = current;
    setCurrent(value);

    startTransition(async () => {
      try {
        await updateLeadStatus(leadId, value, rejectionReason);
        toast.success("Status lead diperbarui");
      } catch {
        setCurrent(previous);
        toast.error("Gagal memperbarui status");
      }
    });
  }

  function handleChange(value: string | null) {
    if (value === null) return;

    if (value === "ditolak") {
      setPendingValue(value);
      setReason("");
      return;
    }

    commitChange(value);
  }

  function handleConfirmReject(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error("Alasan penolakan wajib diisi");
      return;
    }
    commitChange("ditolak", reason.trim());
    setPendingValue(null);
  }

  return (
    <>
      <Select value={current} onValueChange={handleChange} disabled={isPending}>
        <SelectTrigger className="h-8 w-47.5 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {LEAD_STATUS_ORDER.map((s) => (
            <SelectItem key={s} value={s}>
              {LEAD_STATUS_LABEL[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={pendingValue !== null} onOpenChange={(v) => !v && setPendingValue(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alasan penolakan lead</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleConfirmReject} className="grid gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="reason">Alasan</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                placeholder="Contoh: area belum tercover jaringan"
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}