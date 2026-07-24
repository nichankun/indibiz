"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { LEAD_STATUS_LABEL, LEAD_STATUS_ORDER } from "@/lib/utils";
import { updateLeadStatus } from "@/app/admin/(dashboard)/leads/actions";

export function LeadStatusSelect({ leadId, status }: { leadId: number; status: string }) {
  const [current, setCurrent] = useState(status);
  const [isPending, startTransition] = useTransition();

  function handleChange(value: string | null) {
  if (value === null) return; // Select ini tidak punya opsi clear, jadi aman diabaikan

  const previous = current;
  setCurrent(value);

  if (value === "ditolak") {
    const reason = window.prompt("Alasan penolakan lead ini:");
    if (!reason) {
      setCurrent(previous);
      return;
    }
    startTransition(async () => {
      try {
        await updateLeadStatus(leadId, value, reason);
        toast.success("Status lead diperbarui");
      } catch {
        setCurrent(previous);
        toast.error("Gagal memperbarui status");
      }
    });
    return;
  }

  startTransition(async () => {
    try {
      await updateLeadStatus(leadId, value);
      toast.success("Status lead diperbarui");
    } catch {
      setCurrent(previous);
      toast.error("Gagal memperbarui status");
    }
  });
}

  return (
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
  );
}
