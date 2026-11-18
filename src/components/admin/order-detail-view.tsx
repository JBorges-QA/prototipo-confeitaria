"use client";

import { useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, Mail, MapPin, MessageSquareText, Phone, Printer, Store, Truck, XCircle } from "lucide-react";
import { getDataSource } from "@/data";
import { useQuery } from "@/data/hooks";
import { ORDER_FLOW, ORDER_STATUS_META, ORDER_STATUSES, type OrderStatus } from "@/domain/order";
import { buildStatusMessage, whatsappLink } from "@/features/notifications/whatsapp";
import { formatDateLong, formatDateTime } from "@/lib/dates";
import { cn, formatCurrency, formatPhone, formatQuantity } from "@/lib/utils";
import { WhatsappIcon } from "@/components/icons";
import { OrderTimeline } from "@/components/order-timeline";
import { ProductImage } from "@/components/product-image";
import { StatusBadge } from "@/components/status-badge";
import { Button, ButtonLink, buttonClasses } from "@/components/ui/button";
import { Select, Textarea } from "@/components/ui/form";
import { Card, EmptyState, Skeleton } from "@/components/ui/misc";
import { useToast } from "@/components/ui/toast";

export function OrderDetailView({ id }: { id: string }) {
  const toast = useToast();
  const { data: order, loading } = useQuery((ds) => ds.orders.get(id), [id], ["orders"]);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState<OrderStatus | null>(null);

  if (loading && !order) {
    return (
      <div className="mx-auto max-w-5xl space-y-4">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-80" />
      </div>
    );
  }
  if (!order) {
    return <EmptyState title="Encomenda não encontrada" action={<ButtonLink href="/admin/encomendas">Voltar</ButtonLink>} />;
  }

  const idx = ORDER_FLOW.indexOf(order.status);
  const next = idx >= 0 && idx < ORDER_FLOW.length - 1 ? ORDER_FLOW[idx + 1] : null;
  const f = order.fulfillment;

  async function changeStatus(status: OrderStatus) {
    if (!order || status === order.status) return;
    setSaving(status);
    try {
      await getDataSource().orders.updateStatus(order.id, status, note.trim() || undefined);
      setNote("");
      toast(`Status atualizado para “${ORDER_STATUS_META[status].label}”`);
    } catch (e) {
      toast(e instanceof Error ? e.message : "Erro ao atualizar", "error");
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <ButtonLink href="/admin/encomendas" variant="ghost" size="sm" className="-ml-3 print:hidden">
        <ArrowLeft className="h-4 w-4" /> Encomendas
      </ButtonLink>

      <div className="mt-2 mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-medium sm:text-3xl">{order.code}</h1>
          <StatusBadge status={order.status} className="text-sm" />
        </div>
        <Button variant="outline" size="sm" onClick={() => window.print()} className="print:hidden">
          <Printer className="h-4 w-4" /> Imprimir ficha
        </Button>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          {/* Itens */}
          <Card className="overflow-hidden">
            <h2 className="border-b border-cocoa-900/[0.06] px-5 py-4 text-lg font-medium">Itens</h2>
            <ul className="divide-y divide-cocoa-900/[0.06]">
              {order.items.map((it, i) => (
                <li key={i} className="flex items-center gap-3.5 px-5 py-3.5">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl print:hidden">
                    <ProductImage src={it.image} alt={it.name} sizes="56px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{it.name}</p>
                    {it.flavor && <p className="text-sm text-rose-600">{it.flavor}</p>}
                    <p className="text-xs text-cocoa-400">
                      {formatQuantity(it.quantity)} {it.unit === "kg" ? "kg" : it.unit === "unidade" ? "un." : it.unit} × {formatCurrency(it.unitPrice)}
                    </p>
                  </div>
                  <span className="font-bold">{formatCurrency(Math.round(it.unitPrice * it.quantity))}</span>
                </li>
              ))}
            </ul>
            <dl className="space-y-1.5 border-t border-cocoa-900/[0.06] bg-cream-50 px-5 py-4 text-sm">
              <Line label="Subtotal" value={formatCurrency(order.subtotal)} />
              <Line label="Entrega" value={order.deliveryFee ? formatCurrency(order.deliveryFee) : "—"} />
              <div className="flex justify-between pt-1 text-base">
                <dt className="font-bold">Total</dt>
                <dd className="font-extrabold text-rose-600">{formatCurrency(order.total)}</dd>
              </div>
            </dl>
          </Card>

          {order.notes && (
            <Card className="border-gold-500/30 bg-[#fffaf0] p-5">
              <p className="flex items-center gap-2 text-sm font-bold text-[#8a6326]">
                <MessageSquareText className="h-4 w-4" /> Observações do cliente
              </p>
              <p className="mt-2 text-cocoa-700">{order.notes}</p>
            </Card>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="p-5">
              <h3 className="mb-3 text-sm font-bold tracking-wide text-cocoa-400 uppercase">Cliente</h3>
              <p className="text-lg font-bold">{order.customer.name}</p>
              <ul className="mt-2 space-y-1.5 text-sm text-cocoa-700">
                <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-cocoa-400" /> {formatPhone(order.customer.phone)}</li>
                {order.customer.email && <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-cocoa-400" /> {order.customer.email}</li>}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2 print:hidden">
                <a
                  href={whatsappLink(order.customer.phone, buildStatusMessage(order, ORDER_STATUS_META[order.status].label))}
                  target="_blank"
                  rel="noreferrer"
                  className={buttonClasses("whatsapp", "sm")}
                >
                  <WhatsappIcon className="h-4 w-4" /> WhatsApp
                </a>
                <a href={`tel:+55${order.customer.phone}`} className={buttonClasses("outline", "sm")}>
                  <Phone className="h-4 w-4" /> Ligar
                </a>
              </div>
            </Card>
            <Card className="p-5">
              <h3 className="mb-3 text-sm font-bold tracking-wide text-cocoa-400 uppercase">{f.type === "entrega" ? "Entrega" : "Retirada"}</h3>
              <ul className="space-y-2 text-sm text-cocoa-700">
                <li className="flex gap-2"><CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-cocoa-400" /><span className="font-semibold first-letter:uppercase">{formatDateLong(f.date)}</span></li>
                <li className="flex gap-2">{f.type === "entrega" ? <Truck className="mt-0.5 h-4 w-4 shrink-0 text-cocoa-400" /> : <Store className="mt-0.5 h-4 w-4 shrink-0 text-cocoa-400" />}{f.timeSlot}</li>
                {f.address && <li className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-cocoa-400" />{f.address}</li>}
              </ul>
              <p className="mt-4 text-xs text-cocoa-400">Pedido feito em {formatDateTime(order.createdAt)} · via {order.channel}</p>
            </Card>
          </div>

          {order.notifications.length > 0 && (
            <Card className="p-5 print:hidden">
              <h3 className="flex items-center gap-2 text-lg font-medium">
                <WhatsappIcon className="h-5 w-5 text-[#25D366]" /> Mensagens automáticas
              </h3>
              <p className="text-xs text-cocoa-400">Modo demonstração: as mensagens são registradas aqui. Com a API do WhatsApp ativa, são enviadas de verdade.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {order.notifications.map((n, i) => (
                  <div key={i} className="rounded-2xl bg-[#effaf2] p-3.5">
                    <p className="mb-2 text-xs font-bold text-[#1b7a43]">
                      Para {n.to} · {n.status} · {formatDateTime(n.at)}
                    </p>
                    <pre className="max-h-48 overflow-auto font-sans text-xs leading-relaxed whitespace-pre-wrap text-cocoa-700">{n.message.replace(/\*/g, "")}</pre>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Status */}
        <aside className="space-y-4 lg:sticky lg:top-8 print:hidden">
          <Card className="p-5">
            <h2 className="text-lg font-medium">Status do pedido</h2>
            {next && (
              <Button size="lg" className="mt-4 w-full" loading={saving === next} onClick={() => changeStatus(next)}>
                Marcar como {ORDER_STATUS_META[next].label.toLowerCase()} <ArrowRight className="h-4 w-4" />
              </Button>
            )}
            <div className="mt-4 space-y-2">
              <label className="text-xs font-bold text-cocoa-500" htmlFor="status-select">Ou escolha o status</label>
              <Select id="status-select" value={order.status} onChange={(e) => changeStatus(e.target.value as OrderStatus)}>
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {ORDER_STATUS_META[s].label}
                  </option>
                ))}
              </Select>
              <Textarea placeholder="Nota interna (opcional) — registrada no histórico" value={note} onChange={(e) => setNote(e.target.value)} className="min-h-16 text-sm" />
            </div>
            <div className="mt-6 border-t border-cocoa-900/[0.06] pt-5">
              <OrderTimeline order={order} />
            </div>
            {order.status !== "cancelada" && order.status !== "entregue" && (
              <button
                onClick={() => confirm("Cancelar este pedido?") && changeStatus("cancelada")}
                className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-cocoa-400 hover:text-red-600"
              >
                <XCircle className="h-3.5 w-3.5" /> Cancelar pedido
              </button>
            )}
          </Card>

          {order.history.some((h) => h.note) && (
            <Card className="p-5">
              <h3 className="mb-3 text-sm font-bold">Notas internas</h3>
              <ul className="space-y-2.5">
                {order.history.filter((h) => h.note).map((h, i) => (
                  <li key={i} className={cn("rounded-xl bg-cream-100 p-3 text-sm")}>
                    <p>{h.note}</p>
                    <p className="mt-1 text-xs text-cocoa-400">{ORDER_STATUS_META[h.status].label} · {formatDateTime(h.at)}</p>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}

function Line({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex justify-between">
      <dt className="text-cocoa-500">{label}</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  );
}
