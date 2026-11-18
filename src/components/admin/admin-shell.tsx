"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { CalendarDays, ClipboardList, ExternalLink, LayoutDashboard, Loader2, LogOut, Settings, Store } from "lucide-react";
import { Logo } from "@/components/brand";
import { useQuery } from "@/data/hooks";
import { adminAuth, useAdminSession } from "@/features/auth/admin-session";
import { cn, initials } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Início", icon: LayoutDashboard, exact: true },
  { href: "/admin/encomendas", label: "Encomendas", icon: ClipboardList, badge: true },
  { href: "/admin/calendario", label: "Agenda", icon: CalendarDays },
  { href: "/admin/produtos", label: "Cardápio", icon: Store },
  { href: "/admin/configuracoes", label: "Ajustes", icon: Settings },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { ready, user } = useAdminSession();
  const { data: pending } = useQuery(async (ds) => (await ds.orders.list({ status: "recebida" })).length, [], ["orders"]);

  useEffect(() => {
    if (ready && !user) router.replace("/admin/login");
  }, [ready, user, router]);

  if (!ready || !user) {
    return (
      <div className="grid min-h-dvh place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-rose-500" />
      </div>
    );
  }

  const isActive = (href: string, exact?: boolean) => (exact ? pathname === href : pathname.startsWith(href));

  const signOut = () => {
    adminAuth.signOut();
    router.replace("/admin/login");
  };

  return (
    <div className="min-h-dvh bg-[#faf6f1] lg:grid lg:grid-cols-[260px_1fr] print:block print:bg-white">
      {/* Sidebar desktop */}
      <aside className="sticky top-0 hidden h-dvh print:!hidden flex-col border-r border-cocoa-900/[0.07] bg-white px-4 py-6 lg:flex">
        <div className="px-2">
          <Logo href="/admin" />
        </div>
        <nav className="mt-10 flex-1 space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                isActive(item.href, item.exact) ? "bg-blush-100 text-rose-700" : "text-cocoa-500 hover:bg-cocoa-900/[0.04] hover:text-cocoa-900",
              )}
            >
              <item.icon className="h-[18px] w-[18px]" />
              <span className="flex-1">{item.label}</span>
              {item.badge && !!pending && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1.5 text-[0.68rem] font-bold text-white">{pending}</span>
              )}
            </Link>
          ))}
        </nav>
        <Link href="/" target="_blank" className="mb-3 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-cocoa-500 hover:text-rose-600">
          <ExternalLink className="h-4 w-4" /> Ver site
        </Link>
        <div className="flex items-center gap-3 rounded-2xl bg-cream-100 p-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-rose-500 text-sm font-bold text-white">{initials(user.name)}</span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold">{user.name}</p>
            <p className="truncate text-xs text-cocoa-400">{user.email}</p>
          </div>
          <button onClick={signOut} className="grid h-8 w-8 place-items-center rounded-full text-cocoa-400 hover:bg-white hover:text-rose-600" aria-label="Sair">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        {/* Topo mobile */}
        <header className="sticky top-0 z-30 flex h-14 print:hidden items-center justify-between border-b border-cocoa-900/[0.07] bg-white/90 px-4 backdrop-blur lg:hidden">
          <Logo href="/admin" className="scale-90 origin-left" />
          <button onClick={signOut} className="grid h-9 w-9 place-items-center rounded-full text-cocoa-500" aria-label="Sair">
            <LogOut className="h-[18px] w-[18px]" />
          </button>
        </header>

        <main className="flex-1 px-4 pt-5 pb-28 sm:px-6 lg:px-10 lg:pt-8 lg:pb-12">{children}</main>

        {/* Navegação inferior mobile */}
        <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 print:hidden border-t border-cocoa-900/[0.08] bg-white pb-safe lg:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center gap-0.5 pt-2 text-[0.68rem] font-bold",
                isActive(item.href, item.exact) ? "text-rose-600" : "text-cocoa-400",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
              {item.badge && !!pending && (
                <span className="absolute top-1 left-[calc(50%+6px)] grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[0.6rem] text-white">{pending}</span>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

export function PageHeader({ title, description, actions }: { title: string; description?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-medium sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-cocoa-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
