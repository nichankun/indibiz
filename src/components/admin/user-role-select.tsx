"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { changeUserRole } from "@/app/admin/(dashboard)/users/actions";

export type UserRole = "super_admin" | "admin" | "sales" | "viewer";

const ROLE_LABEL: Record<UserRole, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  sales: "Sales",
  viewer: "Viewer",
};

const ROLE_VALUES = Object.keys(ROLE_LABEL) as UserRole[];

function isUserRole(value: string): value is UserRole {
  return (ROLE_VALUES as string[]).includes(value);
}

type Props = {
  userId: number;
  role: string;
  disabled?: boolean;
  /** true kalau baris ini adalah akun yang sedang login sendiri */
  isSelf?: boolean;
};

export function UserRoleSelect({ userId, role, disabled, isSelf }: Props) {
  const [current, setCurrent] = useState(role);
  const [isPending, startTransition] = useTransition();

  function handleChange(value: string | null) {
    if (value === null || !isUserRole(value)) return;

    if (isSelf && current === "super_admin" && value !== "super_admin") {
      toast.error("Anda tidak bisa menurunkan role akun sendiri dari Super Admin.");
      return;
    }

    const previous = current;
    setCurrent(value);
    startTransition(async () => {
      try {
        await changeUserRole(userId, value);
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
        {ROLE_VALUES.map((value) => (
          <SelectItem key={value} value={value}>
            {ROLE_LABEL[value]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}