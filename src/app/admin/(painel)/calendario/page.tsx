"use client";

import { routes } from "@/config/routes";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ChefHat, ChevronLeft, ChevronRight, Store, Truck } from "lucide-react";
import { useQuery } from "@/data/hooks";
import { ORDER_STATUS_META, type Order } from "@/domain/order";
import { addDays, format, isSameDay, ptBR, toDateKey, weekDays, weekStart } from "@/lib/dates";
import { cn, formatCurrency, formatQuantity } from "@/lib/utils";
import { PageHeader } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Card, Skeleton } from "@/components/ui/misc";

const toneBorder: Record<string, string> = {
  rose: "border-l-rose-500",
  gold: "border-l-gold-500",
  violet: "border-l-[#6a4fa3]",
  blue: "border-l-[#2e6aa8]",
  sage: "border-l-sage-500",
  muted: "border-l-cocoa-400",
};

export default function CalendarPage() {
  const [start, setStart] = useState(() => weekStart(new Date()));
  const days = weekDays(start);
  const from = toDateKey(days[0]);
  const to = toDateKey(days[6]);
  const { data: orders } = useQuery((ds) => ds.orders.list({ from, to }), [from, to], ["orders"]);
  const active = useMemo(() => (orders ?? []).filter((o) => o.status !== "cancelada"), [orders]);

  const byDay = (d: Date) => active.filter((o) => o.fulfillment.date === toDateKey(d));
  const today = new Date();

  const production = useMemo(() => {
    const map = new Map<string, { name: string; flavor?: string; unit: string; qty: number }>();
    active
      .filter((o) => o.status !== "entregue")
      .flatMap((o) => o.items)
      .forEach((it) => {
        const key = `${it.productId}|${it.flavor ?? ""}`;
        const cur = map.get(key) ?? { name: it.name, flavor: it.flavor, unit: it.unit, qty: 0 };
        cur.qty += it.quantity;
        map.set(key, cur);
      });
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [active]);

  const label = `${format(days[0], "d MMM", { locale: ptBR })} – ${format(days[6], "d MMM yyyy", { locale: ptBR })}`;

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        title="Agenda da semana"
        description={orders ? `${active.length} encomendas · ${formatCurrency(active.reduce((s, o) => s + o.total, 0))}` : "Carregando…"}
        actions={
          <div className="flex flex-wrap items-center gap-1.5">
            <Button variant="outline" size="icon" onClick={() => setStart(addDays(start, -7))} aria-label="Semana anterior">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setStart(weekStart(new Date()))}>
              Hoje
            </Button>
            <Button variant="outline" size="icon" onClick={() => setStart(addDays(start, 7))} aria-label="Próxima semana">
              <ChevronRight className="h-4 w-4" />
            </Button>
            <span className="ml-2 text-sm font-bold capitalize">{label}</span>
          </div>
        }
      />

      {/* Grade semanal (desktop) / agenda (mobile) */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 xl:gap-2">
        {days.map((d) => {
          const list = byDay(d);
          const isToday = isSameDay(d, today);
          return (
            <div
              key={d.toISOString()}
              className={cn(
                "flex min-w-0 flex-col rounded-2xl border bg-white xl:min-h-[420px]",
                isToday ? "border-rose-400 ring-4 ring-rose-400/10" : "border-cocoa-900/[0.07]",
              )}
            >
              <div className="flex items-center justify-between border-b border-cocoa-900/[0.06] px-3 py-2.5 xl:flex-col xl:items-start xl:gap-0.5">
                <div className="flex items-baseline gap-2">
                  <span className={cn("text-xs font-bold uppercase", isToday ? "text-rose-600" : "text-cocoa-400")}>
                    {format(d, "EEE", { locale: ptBR }).replace(".", "")}
                  </span>
                  <span className={cn("text-xl font-extrabold", isToday && "text-rose-600")}>{format(d, "dd")}</span>
                </div>
                <span className="text-xs font-semibold text-cocoa-400">
                  {list.length ? `${list.length} · ${formatCurrency(list.reduce((s, o) => s + o.total, 0))}` : "—"}
                </span>
              </div>
              <div className="flex-1 space-y-2 p-2">
                {!orders && <Skeleton className="h-16" />}
                {list.map((o) => (
                  <CalendarCard key={o.id} order={o} />
                ))}
                {orders && list.length === 0 && <p className="hidden py-6 text-center text-xs text-cocoa-400/70 sm:block">Sem encomendas</p>}
              </div>
            </div>
          );
        })}
      </div>

      <Card className="mt-6 overflow-hidden">
        <div className="flex items-center gap-2 border-b border-cocoa-900/[0.06] px-5 py-4">
          <ChefHat className="h-5 w-5 text-rose-500" />
          <h2 className="text-lg font-medium">Lista de produção da semana</h2>
          <span className="ml-auto text-xs text-cocoa-400">pedidos não entregues</span>
        </div>
        {production.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-cocoa-400">Nada para produzir nesta semana.</p>
        ) : (
          <ul className="grid divide-y divide-cocoa-900/[0.06] sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-3">
            {production.map((p) => (
              <li key={`${p.name}${p.flavor}`} className="flex items-center justify-between gap-3 px-5 py-3 sm:border-b sm:border-cocoa-900/[0.06]">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{p.name}</p>
                  {p.flavor && <p className="truncate text-xs text-rose-600">{p.flavor}</p>}
                </div>
                <span className="shrink-0 rounded-full bg-cream-100 px-3 py-1 text-sm font-extrabold">
                  {formatQuantity(p.qty)} {p.unit === "kg" ? "kg" : p.unit === "unidade" ? "un." : p.unit}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function CalendarCard({ order }: { order: Order }) {
  const tone = ORDER_STATUS_META[order.status].tone;
  return (
    <Link
      href={routes.adminOrder(order.id)}
      className={cn(
        "block rounded-xl border border-l-4 border-cocoa-900/[0.07] bg-cream-50 p-2.5 transition hover:bg-blush-100/60",
        toneBorder[tone],
      )}
    >
      <p className="flex items-center gap-1 text-[0.7rem] font-bold text-cocoa-400">
        {order.fulfillment.type === "entrega" ? <Truck className="h-3 w-3" /> : <Store className="h-3 w-3" />}
        {order.fulfillment.timeSlot}
      </p>
      <p className="mt-0.5 truncate text-sm font-bold">{order.customer.name}</p>
      <p className="truncate text-xs text-cocoa-500">{order.items.map((i) => i.name).join(", ")}</p>
      <p className="mt-1 flex items-center justify-between text-[0.7rem] font-semibold">
        <span className="text-cocoa-400">{ORDER_STATUS_META[order.status].label}</span>
        <span>{formatCurrency(order.total)}</span>
      </p>
    </Link>
  );
}
