"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { changeUserRole } from "@/app/admin/(dashboard)/users/actions";

const ROLE_LABEL: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  sales: "Sales",
  viewer: "Viewer",
};

export function UserRoleSelect({ userId, role, disabled }: { userId: number; role: string; disabled?: boolean }) {
  const [current, setCurrent] = useState(role);
  const [isPending, startTransition] = useTransition();

  function handleChange(value: string) {
    const previous = current;
    setCurrent(value);
    startTransition(async () => {
      try {
        await changeUserRole(userId, value as never);
        toast.success("Role diperbarui");
      } catch (err) {
        setCurrent(previous);
        toast.error(err instanceof Error ? err.message : "Gagal memperbarui role");
      }
    });
  }

  return (
    <Select value={current} onValueChange={handleChange} disabled={disabled || isPending}>
      <SelectTrigger className="h-8 w-37.5 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(ROLE_LABEL).map(([value, label]) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
