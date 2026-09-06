"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { assignSales } from "@/app/admin/(dashboard)/leads/actions";

type SalesUser = { id: number; name: string; role: "super_admin" | "admin" | "sales" | "viewer" };

export function AssignSalesSelect({
  leadId,
  assignedSalesId,
  salesUsers,
}: {
  leadId: number;
  assignedSalesId: number | null;
  salesUsers: SalesUser[];
}) {
  const [current, setCurrent] = useState(assignedSalesId ? String(assignedSalesId) : undefined);
  const [isPending, startTransition] = useTransition();

  function handleChange(value: string) {
    const previous = current;
    setCurrent(value);
    startTransition(async () => {
      try {
        await assignSales(leadId, Number(value));
        toast.success("Lead ditugaskan");
      } catch (error) {
        setCurrent(previous);
        toast.error(error instanceof Error ? error.message : "Gagal menugaskan lead");
      }
    });
  }

  return (
    <Select value={current} onValueChange={handleChange} disabled={isPending}>
      <SelectTrigger className="ml-1 inline-flex h-7 min-w-36 align-middle text-xs">
        <SelectValue placeholder="Belum ditugaskan" />
      </SelectTrigger>
      <SelectContent>
        {salesUsers.map((user) => (
          <SelectItem key={user.id} value={String(user.id)}>
            {user.name} ({user.role.replace("_", " ")})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
