import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { Sidebar } from "@/components/admin/sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-[var(--secondary)]">
      <Sidebar name={session.name} role={session.role} />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
