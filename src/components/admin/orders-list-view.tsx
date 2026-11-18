"use client";

import { useState } from "react";
import { ClipboardList, Search } from "lucide-react";
import { ORDER_STATUSES, ORDER_STATUS_META, type OrderStatus } from "@/domain/order";
import type { OrderFilter } from "@/data/contracts";
import { useQuery } from "@/data/hooks";
import { cn, formatCurrency } from "@/lib/utils";
import { Card, EmptyState, Skeleton } from "@/components/ui/misc";
import { PageHeader } from "./admin-shell";
import { OrderRow } from "./order-row";

const FILTERS: { value: OrderFilter["status"] | "todas"; label: string }[] = [
  { value: "ativos", label: "Em aberto" },
  ...ORDER_STATUSES.map((s) => ({ value: s, label: ORDER_STATUS_META[s].label })),
  { value: "todas", label: "Todas" },
];

export function OrdersListView({ initialStatus }: { initialStatus: string }) {
  const [status, setStatus] = useState(initialStatus);
  const [search, setSearch] = useState("");

  const { data: orders } = useQuery(
    (ds) =>
      ds.orders.list({
        status: status === "todas" ? undefined : (status as OrderStatus | "ativos"),
        search: search.trim() || undefined,
      }),
    [status, search],
    ["orders"],
  );

  const total = (orders ?? []).filter((o) => o.status !== "cancelada").reduce((s, o) => s + o.total, 0);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Encomendas"
        description={orders ? `${orders.length} pedidos · ${formatCurrency(total)}` : "Carregando…"}
      />

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="relative lg:w-72">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-cocoa-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, código ou telefone"
            className="h-11 w-full rounded-full border border-cocoa-900/10 bg-white pr-4 pl-10 text-sm focus:border-rose-400 focus:outline-none"
          />
        </label>
        <div className="scrollbar-none -mx-4 flex gap-1.5 overflow-x-auto px-4 lg:mx-0 lg:px-0">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatus(f.value!)}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-2 text-sm font-semibold transition",
                status === f.value ? "bg-cocoa-900 text-cream-50" : "bg-white text-cocoa-500 ring-1 ring-cocoa-900/10 hover:text-cocoa-900",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <Card className="overflow-hidden">
        {!orders ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <EmptyState icon={<ClipboardList className="h-6 w-6" />} title="Nenhuma encomenda encontrada" description="Ajuste os filtros ou a busca." />
        ) : (
          <div className="divide-y divide-cocoa-900/[0.06]">
            {orders.map((o) => (
              <OrderRow key={o.id} order={o} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
