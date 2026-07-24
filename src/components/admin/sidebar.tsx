"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users2, Package2, LogOut, Wifi, ShieldCheck, Settings, BarChart3, ScrollText } from "lucide-react";
import { cn } from "@/lib/utils";

const baseNavItems = [
  { href: "/admin", label: "Ringkasan", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Manajemen Lead", icon: Users2 },
  { href: "/admin/analytics", label: "Funnel Konversi", icon: BarChart3 },
  { href: "/admin/packages", label: "Paket & Harga", icon: Package2 },
  { href: "/admin/settings", label: "Pengaturan Akun", icon: Settings },
];

const superAdminNavItems = [
  { href: "/admin/users", label: "Akun Tim", icon: ShieldCheck },
  { href: "/admin/audit-log", label: "Audit Log", icon: ScrollText },
];

export function Sidebar({ name, role }: { name: string; role: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const navItems = role === "super_admin" || role === "admin" ? [...baseNavItems, ...superAdminNavItems] : baseNavItems;

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-border bg-white">
      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Wifi className="h-4 w-4 text-white" />
        </div>
        <span className="font-(family-name:--font-display) font-semibold">Indibiz Admin</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href as never}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <div className="mb-2 px-2">
          <div className="text-sm font-medium">{name}</div>
          <div className="text-xs capitalize text-muted-foreground">{role.replace("_", " ")}</div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          Keluar
        </button>
      </div>
    </aside>
  );
}
