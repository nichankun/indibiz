"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Users2,
  Package2,
  LogOut,
  ShieldCheck,
  Settings,
  BarChart3,
  ScrollText,
  Wifi,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const baseNavItems = [
  { href: "/admin", label: "Ringkasan", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Manajemen Lead", icon: Users2 },
  { href: "/admin/analytics", label: "Funnel Konversi", icon: BarChart3 },
  { href: "/admin/packages", label: "Paket & Harga", icon: Package2 },
  { href: "/admin/settings", label: "Pengaturan Akun", icon: Settings },
];

export function AppSidebar({ name, role }: { name: string; role: string }) {
  const pathname = usePathname();
  const router = useRouter();

  // Akun Tim (create/toggle/ubah role) hanya boleh super_admin — harus
  // sinkron dengan assertSuperAdmin() di users/actions.ts. Audit Log
  // dibiarkan bisa dilihat admin juga karena itu murni read-only.
  const canManageUsers = role === "super_admin";
  const canViewAuditLog = role === "super_admin" || role === "admin";

  async function handleLogout() {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error();
    } catch {
      toast.error("Gagal keluar, coba lagi.");
      return;
    }
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-white">
                  <Wifi className="size-4" />
                </div>
                <span className="font-display font-semibold">Indibiz Admin</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {baseNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {(canManageUsers || canViewAuditLog) && (
          <SidebarGroup>
            <SidebarGroupLabel>Manajemen</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {canManageUsers && (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/admin/users"} tooltip="Akun Tim">
                      <Link href="/admin/users">
                        <ShieldCheck />
                        <span>Akun Tim</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}

                {canViewAuditLog && (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/admin/audit-log"} tooltip="Audit Log">
                      <Link href="/admin/audit-log">
                        <ScrollText />
                        <span>Audit Log</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" disabled className="cursor-default opacity-100">
              <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-secondary text-xs font-semibold">
                {name.slice(0, 1).toUpperCase()}
              </div>
              <div className="flex flex-col overflow-hidden text-left">
                <span className="truncate text-sm font-medium">{name}</span>
                <span className="truncate text-xs capitalize text-muted-foreground">
                  {role.replace("_", " ")}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} tooltip="Keluar">
              <LogOut />
              <span>Keluar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}