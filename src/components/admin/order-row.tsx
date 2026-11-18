"use client";

import Link from "next/link";
import { ChevronRight, Store, Truck } from "lucide-react";
import type { Order } from "@/domain/order";
import { formatDateShort, formatWeekday, fromDateKey } from "@/lib/dates";
import { formatCurrency } from "@/lib/utils";
import { StatusBadge } from "@/components/status-badge";

export function OrderRow({ order, showDate = true }: { order: Order; showDate?: boolean }) {
  const f = order.fulfillment;
  const summary = order.items.map((i) => i.name).join(", ");
  return (
    <Link
      href={`/admin/encomendas/${order.id}`}
      className="group flex items-center gap-3 px-4 py-3.5 transition hover:bg-cream-50 sm:gap-4 sm:px-5"
    >
      {showDate && (
        <div className="flex w-12 shrink-0 flex-col items-center rounded-xl bg-cream-100 py-1.5">
          <span className="text-[0.62rem] font-bold text-cocoa-400 uppercase">{formatWeekday(fromDateKey(f.date)).replace(".", "")}</span>
          <span className="text-sm font-extrabold">{formatDateShort(f.date)}</span>
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-bold text-cocoa-900">{order.customer.name}</span>
          <span className="text-xs font-semibold text-cocoa-400">{order.code}</span>
        </div>
        <p className="mt-0.5 truncate text-sm text-cocoa-500">{summary}</p>
        <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-cocoa-400">
          {f.type === "entrega" ? <Truck className="h-3.5 w-3.5" /> : <Store className="h-3.5 w-3.5" />}
          {f.type === "entrega" ? "Entrega" : "Retirada"} · {f.timeSlot}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <StatusBadge status={order.status} />
        <span className="text-sm font-extrabold">{formatCurrency(order.total)}</span>
      </div>
      <ChevronRight className="hidden h-4 w-4 shrink-0 text-cocoa-400 transition group-hover:translate-x-0.5 sm:block" />
    </Link>
  );
}
