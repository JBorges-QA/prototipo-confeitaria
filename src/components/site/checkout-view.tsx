"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { AlertCircle, ArrowLeft, Lock, MapPin, ShoppingBag, Store, Truck } from "lucide-react";
import { checkoutSchema, type FulfillmentType } from "@/domain/order";
import { useSettings } from "@/data/hooks";
import { useCart } from "@/features/cart/cart-context";
import { placeOrder } from "@/features/orders/place-order";
import { computeTotals } from "@/features/orders/pricing";
import { availableDates, format, formatDateLong, ptBR, toDateKey } from "@/lib/dates";
import { cn, formatCurrency, formatPhone } from "@/lib/utils";
import { Button, ButtonLink } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/form";
import { EmptyState, Skeleton } from "@/components/ui/misc";
import { CartLines } from "./cart-sheet";

type Errors = Partial<Record<string, string>>;

export function CheckoutView() {
  const router = useRouter();
  const cart = useCart();
  const { data: settings } = useSettings();

  const [type, setType] = useState<FulfillmentType>("entrega");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", notes: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const dates = useMemo(
    () => (settings ? availableDates({ minLeadDays: settings.minLeadDays, closedWeekdays: settings.closedWeekdays, count: 21 }) : []),
    [settings],
  );

  const effectiveType: FulfillmentType =
    settings && !settings.deliveryEnabled ? "retirada" : settings && !settings.pickupEnabled ? "entrega" : type;
  const totals = settings ? computeTotals(cart.items, effectiveType, settings) : null;
  const belowMinimum = !!settings && cart.subtotal < settings.minOrderValue;

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => {
    const value = k === "phone" ? formatPhone(e.target.value) : e.target.value;
    setForm((f) => ({ ...f, [k]: value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  async function submit(e: FormEvent) {
    e.preventDefault();
    setSubmitError("");
    const parsed = checkoutSchema.safeParse({ ...form, fulfillmentType: effectiveType, date, timeSlot });
    if (!parsed.success) {
      const errs: Errors = {};
      for (const issue of parsed.error.issues) errs[String(issue.path[0])] ??= issue.message;
      setErrors(errs);
      document.querySelector(`[data-field="${Object.keys(errs)[0]}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const d = parsed.data;
    setSubmitting(true);
    try {
      const order = await placeOrder({
        customer: { name: d.name, phone: d.phone, email: d.email || undefined },
        fulfillment: { type: d.fulfillmentType, date: d.date, timeSlot: d.timeSlot, address: d.fulfillmentType === "entrega" ? d.address : undefined },
        items: cart.items.map((i) => ({
          productId: i.productId,
          name: i.name,
          unit: i.unit,
          unitPrice: i.unitPrice,
          quantity: i.quantity,
          flavor: i.flavor,
          image: i.image,
        })),
        notes: d.notes || undefined,
      });
      cart.clear();
      router.push(`/pedido/${order.code}?novo=1`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Não foi possível enviar o pedido.");
      setSubmitting(false);
    }
  }

  if (!cart.ready || !settings) {
    return (
      <div className="container-page grid gap-6 py-10 lg:grid-cols-[1fr_380px]">
        <Skeleton className="h-96" />
        <Skeleton className="h-72" />
      </div>
    );
  }

  if (cart.items.length === 0 && !submitting) {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={<ShoppingBag className="h-6 w-6" />}
          title="Seu pedido está vazio"
          description="Adicione itens do cardápio para escolher a data e finalizar."
          action={<ButtonLink href="/cardapio">Ver cardápio</ButtonLink>}
        />
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="container-page pt-4 pb-40 sm:pt-8 lg:pb-20">
      <ButtonLink href="/cardapio" variant="ghost" size="sm" className="-ml-3">
        <ArrowLeft className="h-4 w-4" /> Continuar comprando
      </ButtonLink>
      <h1 className="mt-2 text-3xl font-medium sm:text-4xl">Finalizar pedido</h1>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_380px] lg:gap-10">
        <div className="min-w-0 space-y-5">
          <Step n={1} title="Como você quer receber?">
            <div className="grid grid-cols-2 gap-3">
              {settings.deliveryEnabled && (
                <ChoiceCard
                  active={effectiveType === "entrega"}
                  onClick={() => setType("entrega")}
                  icon={<Truck className="h-5 w-5" />}
                  title="Entrega"
                  subtitle={`Taxa ${formatCurrency(settings.deliveryFee)}`}
                />
              )}
              {settings.pickupEnabled && (
                <ChoiceCard
                  active={effectiveType === "retirada"}
                  onClick={() => setType("retirada")}
                  icon={<Store className="h-5 w-5" />}
                  title="Retirada"
                  subtitle="Sem custo"
                />
              )}
            </div>
            {effectiveType === "entrega" ? (
              <Field label="Endereço de entrega" error={errors.address} hint={settings.serviceArea} className="mt-4" htmlFor="address">
                <div data-field="address">
                  <Textarea id="address" rows={2} className="min-h-0" placeholder="Rua, número, complemento, bairro" value={form.address} onChange={set("address")} aria-invalid={!!errors.address} />
                </div>
              </Field>
            ) : (
              <p className="mt-4 flex items-start gap-2 rounded-xl bg-cream-100 p-3 text-sm text-cocoa-500">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" /> Retirada em: {settings.pickupAddress}
              </p>
            )}
          </Step>

          <Step n={2} title="Data e horário">
            <div data-field="date" className="scrollbar-none -mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
              {dates.map((d) => {
                const key = toDateKey(d);
                const on = key === date;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setDate(key);
                      setErrors((er) => ({ ...er, date: undefined }));
                    }}
                    className={cn(
                      "flex w-[4.5rem] shrink-0 flex-col items-center rounded-2xl border py-2.5 transition",
                      on ? "border-rose-500 bg-rose-500 text-white shadow-soft" : "border-cocoa-900/10 bg-white hover:border-rose-400",
                    )}
                  >
                    <span className={cn("text-[0.68rem] font-bold uppercase", on ? "text-white/80" : "text-cocoa-400")}>
                      {format(d, "EEE", { locale: ptBR }).replace(".", "")}
                    </span>
                    <span className="text-xl leading-tight font-extrabold">{format(d, "dd")}</span>
                    <span className={cn("text-[0.68rem] font-semibold", on ? "text-white/80" : "text-cocoa-400")}>
                      {format(d, "MMM", { locale: ptBR }).replace(".", "")}
                    </span>
                  </button>
                );
              })}
            </div>
            {errors.date && <p className="mt-2 text-xs font-medium text-red-600">{errors.date}</p>}

            <p className="mt-5 mb-2 text-sm font-semibold text-cocoa-700">Horário</p>
            <div data-field="timeSlot" className="flex flex-wrap gap-2">
              {settings.timeSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => {
                    setTimeSlot(slot);
                    setErrors((er) => ({ ...er, timeSlot: undefined }));
                  }}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-semibold transition",
                    timeSlot === slot ? "border-cocoa-900 bg-cocoa-900 text-cream-50" : "border-cocoa-900/12 bg-white hover:border-rose-400",
                  )}
                >
                  {slot}
                </button>
              ))}
            </div>
            {errors.timeSlot && <p className="mt-2 text-xs font-medium text-red-600">{errors.timeSlot}</p>}
          </Step>

          <Step n={3} title="Seus dados">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nome completo" error={errors.name} htmlFor="name" className="sm:col-span-2">
                <div data-field="name">
                  <Input id="name" autoComplete="name" value={form.name} onChange={set("name")} aria-invalid={!!errors.name} placeholder="Como podemos te chamar?" />
                </div>
              </Field>
              <Field label="WhatsApp" error={errors.phone} hint="Enviaremos a confirmação por aqui" htmlFor="phone">
                <div data-field="phone">
                  <Input id="phone" inputMode="tel" autoComplete="tel" value={form.phone} onChange={set("phone")} aria-invalid={!!errors.phone} placeholder="(11) 99999-9999" />
                </div>
              </Field>
              <Field label="E-mail (opcional)" error={errors.email} htmlFor="email">
                <div data-field="email">
                  <Input id="email" type="email" autoComplete="email" value={form.email} onChange={set("email")} aria-invalid={!!errors.email} placeholder="voce@email.com" />
                </div>
              </Field>
              <Field label="Observações (opcional)" htmlFor="notes" className="sm:col-span-2" hint="Tema da festa, frase no bolo, restrições alimentares…">
                <Textarea id="notes" value={form.notes} onChange={set("notes")} maxLength={500} />
              </Field>
            </div>
          </Step>
        </div>

        {/* Resumo */}
        <aside className="min-w-0 lg:sticky lg:top-24">
          <div className="rounded-3xl border border-cocoa-900/[0.07] bg-white p-5 shadow-soft">
            <h2 className="text-xl font-medium">Resumo</h2>
            <CartLines compact />
            {totals && (
              <dl className="space-y-2 border-t border-cocoa-900/[0.08] pt-4 text-sm">
                <Row label="Subtotal" value={formatCurrency(totals.subtotal)} />
                <Row label={effectiveType === "entrega" ? "Entrega" : "Retirada"} value={totals.deliveryFee ? formatCurrency(totals.deliveryFee) : "Grátis"} />
                {date && <Row label="Data" value={`${formatDateLong(date)}${timeSlot ? ` · ${timeSlot}` : ""}`} />}
                <div className="flex items-center justify-between pt-2 text-base">
                  <dt className="font-bold">Total</dt>
                  <dd className="text-xl font-extrabold text-rose-600">{formatCurrency(totals.total)}</dd>
                </div>
              </dl>
            )}
            {belowMinimum && (
              <p className="mt-4 flex gap-2 rounded-xl bg-[#fbf1df] p-3 text-xs font-medium text-[#8a6326]">
                <AlertCircle className="h-4 w-4 shrink-0" /> Pedido mínimo de {formatCurrency(settings.minOrderValue)}. Adicione mais itens para continuar.
              </p>
            )}
            {submitError && (
              <p className="mt-4 flex gap-2 rounded-xl bg-red-50 p-3 text-xs font-medium text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" /> {submitError}
              </p>
            )}
            <Button type="submit" size="lg" className="mt-5 hidden w-full lg:flex" loading={submitting} disabled={belowMinimum}>
              Enviar pedido
            </Button>
            <p className="mt-3 hidden items-center justify-center gap-1.5 text-xs text-cocoa-400 lg:flex">
              <Lock className="h-3.5 w-3.5" /> O pagamento é combinado após a confirmação
            </p>
          </div>
        </aside>
      </div>

      {/* Barra fixa mobile */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-cocoa-900/10 bg-white/95 px-4 pt-3 pb-safe backdrop-blur lg:hidden">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-cocoa-500">Total</span>
          <span className="text-lg font-extrabold text-rose-600">{totals && formatCurrency(totals.total)}</span>
        </div>
        <Button type="submit" size="lg" className="w-full" loading={submitting} disabled={belowMinimum}>
          Enviar pedido
        </Button>
      </div>
    </form>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-cocoa-900/[0.07] bg-white p-5 shadow-soft">
      <h2 className="mb-4 flex items-center gap-3 text-xl font-medium">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-blush-100 font-sans text-sm font-extrabold text-rose-600">{n}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function ChoiceCard({ active, onClick, icon, title, subtitle }: { active: boolean; onClick: () => void; icon: ReactNode; title: string; subtitle: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-2xl border-2 p-3.5 text-left transition",
        active ? "border-rose-500 bg-blush-100/60" : "border-cocoa-900/10 hover:border-rose-300",
      )}
    >
      <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl", active ? "bg-rose-500 text-white" : "bg-cream-100 text-cocoa-500")}>{icon}</span>
      <span>
        <span className="block font-bold">{title}</span>
        <span className="block text-xs text-cocoa-400">{subtitle}</span>
      </span>
    </button>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-cocoa-500">{label}</dt>
      <dd className="text-right font-semibold first-letter:uppercase">{value}</dd>
    </div>
  );
}
