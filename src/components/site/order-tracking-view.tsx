"use client";

import { CalendarDays, CheckCircle2, MapPin, PackageSearch, Store, Truck } from "lucide-react";
import { useQuery, useSettings } from "@/data/hooks";
import { buildBusinessMessage, whatsappLink } from "@/features/notifications/whatsapp";
import { formatDateLong } from "@/lib/dates";
import { formatCurrency, formatQuantity } from "@/lib/utils";
import { WhatsappIcon } from "@/components/icons";
import { OrderTimeline } from "@/components/order-timeline";
import { ProductImage } from "@/components/product-image";
import { StatusBadge } from "@/components/status-badge";
import { ButtonLink, buttonClasses } from "@/components/ui/button";
import { EmptyState, Skeleton } from "@/components/ui/misc";

export function OrderTrackingView({ code, isNew }: { code: string; isNew: boolean }) {
  const { data: order, loading } = useQuery((ds) => ds.orders.getByCode(code), [code], ["orders"]);
  const { data: settings } = useSettings();

  if (loading && !order) {
    return (
      <div className="container-page max-w-3xl space-y-4 py-10">
        <Skeleton className="h-40" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={<PackageSearch className="h-6 w-6" />}
          title="Pedido não encontrado"
          description={`Não localizamos o pedido “${code}”. Confira o código recebido no WhatsApp.`}
          action={<ButtonLink href="/acompanhar">Buscar outro pedido</ButtonLink>}
        />
      </div>
    );
  }

  const f = order.fulfillment;
  const businessMsg = order.notifications.find((n) => n.to === "confeitaria")?.message ?? buildBusinessMessage(order);

  return (
    <div className="container-page max-w-3xl py-8 sm:py-12">
      {isNew && (
        <div className="mb-8 animate-fade-up text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-sage-100 text-sage-500">
            <CheckCircle2 className="h-9 w-9" />
          </span>
          <h1 className="mt-4 text-3xl font-medium sm:text-4xl">Pedido enviado com sucesso!</h1>
          <p className="mx-auto mt-2 max-w-md text-cocoa-500">
            Obrigada, {order.customer.name.split(" ")[0]}! Você receberá a confirmação no WhatsApp em instantes. Guarde o código abaixo para
            acompanhar seu pedido.
          </p>
        </div>
      )}

      <div className="overflow-hidden rounded-3xl border border-cocoa-900/[0.07] bg-white shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dashed border-cocoa-900/15 bg-cream-50 px-5 py-4">
          <div>
            <p className="text-xs font-semibold tracking-wider text-cocoa-400 uppercase">Pedido</p>
            <p className="font-display text-2xl font-medium">{order.code}</p>
          </div>
          <StatusBadge status={order.status} className="text-sm" />
        </div>

        <div className="px-5 py-6">
          <OrderTimeline order={order} orientation="horizontal" />
        </div>

        <div className="grid gap-3 border-t border-cocoa-900/[0.06] px-5 py-5 sm:grid-cols-2">
          <Info icon={<CalendarDays className="h-4 w-4" />} label={f.type === "entrega" ? "Entrega" : "Retirada"}>
            <span className="first-letter:uppercase">{formatDateLong(f.date)}</span> · {f.timeSlot}
          </Info>
          <Info icon={f.type === "entrega" ? <Truck className="h-4 w-4" /> : <Store className="h-4 w-4" />} label={f.type === "entrega" ? "Endereço" : "Local de retirada"}>
            {f.type === "entrega" ? f.address : settings?.pickupAddress}
          </Info>
        </div>

        <ul className="divide-y divide-cocoa-900/[0.06] border-t border-cocoa-900/[0.06] px-5">
          {order.items.map((it, i) => (
            <li key={i} className="flex items-center gap-3 py-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                <ProductImage src={it.image} alt={it.name} sizes="48px" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{it.name}</p>
                <p className="text-xs text-cocoa-400">
                  {formatQuantity(it.quantity)} {it.unit === "kg" ? "kg" : "×"} {it.flavor && `· ${it.flavor}`}
                </p>
              </div>
              <span className="text-sm font-bold">{formatCurrency(Math.round(it.unitPrice * it.quantity))}</span>
            </li>
          ))}
        </ul>
        <dl className="space-y-1.5 border-t border-cocoa-900/[0.06] bg-cream-50 px-5 py-4 text-sm">
          <div className="flex justify-between"><dt className="text-cocoa-500">Subtotal</dt><dd className="font-semibold">{formatCurrency(order.subtotal)}</dd></div>
          {order.deliveryFee > 0 && (
            <div className="flex justify-between"><dt className="text-cocoa-500">Entrega</dt><dd className="font-semibold">{formatCurrency(order.deliveryFee)}</dd></div>
          )}
          <div className="flex justify-between pt-1 text-base"><dt className="font-bold">Total</dt><dd className="font-extrabold text-rose-600">{formatCurrency(order.total)}</dd></div>
        </dl>
      </div>

      {settings && (
        <div className="mt-6 rounded-3xl border border-[#25D366]/25 bg-[#effaf2] p-5">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#25D366] text-white">
              <WhatsappIcon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="font-bold text-cocoa-900">Pedido encaminhado para o WhatsApp da confeitaria</p>
              <p className="text-xs text-cocoa-500">Prévia da mensagem automática (modo demonstração)</p>
            </div>
          </div>
          <pre className="mt-4 max-h-60 overflow-auto rounded-2xl bg-white p-4 font-sans text-[0.82rem] leading-relaxed whitespace-pre-wrap text-cocoa-700 shadow-soft">
            {businessMsg.replace(/\*/g, "")}
          </pre>
          <a
            href={whatsappLink(settings.whatsapp, `Olá! Gostaria de falar sobre o pedido ${order.code}.`)}
            target="_blank"
            rel="noreferrer"
            className={buttonClasses("whatsapp", "md", "mt-4 w-full sm:w-auto")}
          >
            <WhatsappIcon className="h-4 w-4" /> Falar com a confeitaria
          </a>
        </div>
      )}

      <div className="mt-8 text-center">
        <ButtonLink href="/cardapio" variant="outline">
          Voltar ao cardápio
        </ButtonLink>
      </div>
    </div>
  );
}

function Info({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-2xl bg-cream-100 p-3.5">
      <span className="mt-0.5 text-rose-500">{icon}</span>
      <div>
        <p className="text-xs font-semibold text-cocoa-400">{label}</p>
        <p className="text-sm font-semibold text-cocoa-900">{children ?? <MapPin className="h-4 w-4" />}</p>
      </div>
    </div>
  );
}
