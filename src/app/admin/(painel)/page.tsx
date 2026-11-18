"use client";

import { routes } from "@/config/routes";
import Link from "next/link";
import { ArrowRight, BellRing, CakeSlice, CalendarCheck, Wallet } from "lucide-react";
import type { ReactNode } from "react";
import { useQuery } from "@/data/hooks";
import { addDays, toDateKey, weekStart, formatDateLong } from "@/lib/dates";
import { formatCurrency } from "@/lib/utils";
import { PageHeader } from "@/components/admin/admin-shell";
import { OrderRow } from "@/components/admin/order-row";
import { Card, EmptyState, Skeleton } from "@/components/ui/misc";
import { useAdminSession } from "@/features/auth/admin-session";

export default function DashboardPage() {
  const { user } = useAdminSession();
  const { data: orders } = useQuery((ds) => ds.orders.list(), [], ["orders"]);

  const today = toDateKey(new Date());
  const ws = weekStart(new Date());
  const weekFrom = toDateKey(ws);
  const weekTo = toDateKey(addDays(ws, 6));

  const active = (orders ?? []).filter((o) => o.status !== "cancelada");
  const pending = active.filter((o) => o.status === "recebida");
  const todays = active.filter((o) => o.fulfillment.date === today);
  const week = active.filter((o) => o.fulfillment.date >= weekFrom && o.fulfillment.date <= weekTo);
  const upcoming = active.filter((o) => o.fulfillment.date > today && o.status !== "entregue").slice(0, 6);
  const inProduction = active.filter((o) => o.status === "em_producao").length;

  const hour = new Date().getHours();
  const greet = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title={`${greet}, ${user?.name ?? ""}! 🌸`}
        description={<span className="first-letter:uppercase">{formatDateLong(today)}</span>}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Stat icon={<BellRing className="h-5 w-5" />} label="Novos pedidos" value={orders ? pending.length : null} hint="aguardando confirmação" accent />
        <Stat icon={<CalendarCheck className="h-5 w-5" />} label="Para hoje" value={orders ? todays.length : null} hint="entregas e retiradas" />
        <Stat icon={<CakeSlice className="h-5 w-5" />} label="Em produção" value={orders ? inProduction : null} hint="pedidos no forno" />
        <Stat
          icon={<Wallet className="h-5 w-5" />}
          label="Previsto na semana"
          value={orders ? formatCurrency(week.reduce((s, o) => s + o.total, 0)) : null}
          hint={`${week.length} encomendas`}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card className="overflow-hidden">
          <SectionHead title="Novos pedidos" href={routes.adminOrders("recebida")} />
          {!orders ? (
            <ListSkeleton />
          ) : pending.length === 0 ? (
            <EmptyState title="Tudo em dia!" description="Nenhum pedido aguardando confirmação." className="py-10" />
          ) : (
            <div className="divide-y divide-cocoa-900/[0.06]">{pending.map((o) => <OrderRow key={o.id} order={o} />)}</div>
          )}
        </Card>

        <Card className="overflow-hidden">
          <SectionHead title="Hoje" href="/admin/calendario" />
          {!orders ? (
            <ListSkeleton />
          ) : todays.length === 0 ? (
            <EmptyState title="Agenda livre hoje" className="py-10" />
          ) : (
            <div className="divide-y divide-cocoa-900/[0.06]">{todays.map((o) => <OrderRow key={o.id} order={o} showDate={false} />)}</div>
          )}
        </Card>
      </div>

      <Card className="mt-6 overflow-hidden">
        <SectionHead title="Próximas encomendas" href="/admin/encomendas" />
        {!orders ? (
          <ListSkeleton />
        ) : (
          <div className="divide-y divide-cocoa-900/[0.06]">{upcoming.map((o) => <OrderRow key={o.id} order={o} />)}</div>
        )}
      </Card>
    </div>
  );
}

function Stat({ icon, label, value, hint, accent }: { icon: ReactNode; label: string; value: ReactNode; hint: string; accent?: boolean }) {
  return (
    <Card className={accent ? "border-transparent bg-rose-500 p-4 text-white sm:p-5" : "p-4 sm:p-5"}>
      <div className="flex items-center justify-between">
        <span className={accent ? "text-sm font-semibold text-white/85" : "text-sm font-semibold text-cocoa-500"}>{label}</span>
        <span className={accent ? "text-white/80" : "text-rose-400"}>{icon}</span>
      </div>
      <div className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">{value ?? <Skeleton className="h-8 w-16" />}</div>
      <p className={accent ? "mt-0.5 text-xs text-white/75" : "mt-0.5 text-xs text-cocoa-400"}>{hint}</p>
    </Card>
  );
}

function SectionHead({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex items-center justify-between border-b border-cocoa-900/[0.06] px-5 py-4">
      <h2 className="text-lg font-medium">{title}</h2>
      <Link href={href} className="inline-flex items-center gap-1 text-sm font-bold text-rose-600">
        Ver tudo <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="space-y-3 p-5">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-16" />
      ))}
    </div>
  );
}
