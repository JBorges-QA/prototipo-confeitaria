import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: { default: "Painel", template: "%s · Painel Flor de Açúcar" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AdminShell>{children}</AdminShell>
    </ToastProvider>
  );
}
