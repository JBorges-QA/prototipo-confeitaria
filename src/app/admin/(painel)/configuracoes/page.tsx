"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { CreditCard, ImagePlus, Plus, RotateCcw, X } from "lucide-react";
import { getDataSource } from "@/data";
import { useSettings } from "@/data/hooks";
import type { BusinessSettings } from "@/domain/settings";
import { resizeImage } from "@/lib/image";
import { WEEKDAY_NAMES } from "@/lib/dates";
import { centsToInput, cn, formatPhone, parseCurrencyToCents } from "@/lib/utils";
import { PageHeader } from "@/components/admin/admin-shell";
import { InstagramIcon, WhatsappIcon } from "@/components/icons";
import { ProductImage } from "@/components/product-image";
import { Button } from "@/components/ui/button";
import { Field, Input, Switch, Textarea } from "@/components/ui/form";
import { Badge, Card, Skeleton } from "@/components/ui/misc";
import { useToast } from "@/components/ui/toast";

export default function SettingsPage() {
  const { data } = useSettings();
  if (!data) {
    return (
      <div className="mx-auto max-w-4xl space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96" />
      </div>
    );
  }
  return <SettingsForm initial={data} />;
}

function SettingsForm({ initial }: { initial: BusinessSettings }) {
  const toast = useToast();
  const [s, setS] = useState(initial);
  const [fee, setFee] = useState(centsToInput(initial.deliveryFee));
  const [minOrder, setMinOrder] = useState(centsToInput(initial.minOrderValue));
  const [slotInput, setSlotInput] = useState("");
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- sincroniza após "restaurar demonstração"
  useEffect(() => setS(initial), [initial]);

  const set = <K extends keyof BusinessSettings>(k: K, v: BusinessSettings[K]) => setS((p) => ({ ...p, [k]: v }));
  const dirty = JSON.stringify(s) !== JSON.stringify(initial) || fee !== centsToInput(initial.deliveryFee) || minOrder !== centsToInput(initial.minOrderValue);

  async function save() {
    setSaving(true);
    try {
      await getDataSource().settings.save({
        ...s,
        whatsapp: s.whatsapp.replace(/\D/g, ""),
        deliveryFee: parseCurrencyToCents(fee),
        minOrderValue: parseCurrencyToCents(minOrder),
      });
      toast("Configurações salvas");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Erro ao salvar", "error");
    } finally {
      setSaving(false);
    }
  }

  async function reset() {
    if (!confirm("Restaurar todos os dados de demonstração? Produtos, pedidos e ajustes voltarão ao estado inicial.")) return;
    await getDataSource().resetDemo?.();
    toast("Dados de demonstração restaurados");
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Ajustes"
        description="Informações exibidas no site e regras das encomendas."
        actions={
          <Button onClick={save} loading={saving} disabled={!dirty}>
            Salvar alterações
          </Button>
        }
      />

      <div className="space-y-6">
        <Section title="Dados do negócio">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nome exibido" htmlFor="bn"><Input id="bn" value={s.businessName} onChange={(e) => set("businessName", e.target.value)} /></Field>
            <Field label="Seu nome" htmlFor="on"><Input id="on" value={s.ownerName} onChange={(e) => set("ownerName", e.target.value)} /></Field>
            <Field label="WhatsApp que recebe os pedidos" hint="Com DDD" htmlFor="wa">
              <Input id="wa" inputMode="tel" value={formatPhone(s.whatsapp)} onChange={(e) => set("whatsapp", `55${e.target.value.replace(/\D/g, "").slice(0, 11)}`)} />
            </Field>
            <Field label="Instagram" htmlFor="ig">
              <div className="relative">
                <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-cocoa-400">@</span>
                <Input id="ig" className="pl-8" value={s.instagram} onChange={(e) => set("instagram", e.target.value.replace("@", ""))} />
              </div>
            </Field>
            <Field label="E-mail" htmlFor="em"><Input id="em" type="email" value={s.email} onChange={(e) => set("email", e.target.value)} /></Field>
            <Field label="Horário de atendimento" htmlFor="oh"><Input id="oh" value={s.openingHours} onChange={(e) => set("openingHours", e.target.value)} /></Field>
            <Field label="Endereço de retirada" className="sm:col-span-2" htmlFor="pa"><Input id="pa" value={s.pickupAddress} onChange={(e) => set("pickupAddress", e.target.value)} /></Field>
            <Field label="Área de entrega" className="sm:col-span-2" htmlFor="sa"><Input id="sa" value={s.serviceArea} onChange={(e) => set("serviceArea", e.target.value)} /></Field>
          </div>
        </Section>

        <Section title="Regras das encomendas">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Antecedência mínima (dias)" htmlFor="lead">
              <Input id="lead" type="number" min={0} max={30} value={s.minLeadDays} onChange={(e) => set("minLeadDays", Math.max(0, Number(e.target.value)))} />
            </Field>
            <Field label="Valor mínimo do pedido (R$)" htmlFor="mo">
              <Input id="mo" inputMode="decimal" value={minOrder} onChange={(e) => setMinOrder(e.target.value)} />
            </Field>
          </div>

          <div className="mt-5">
            <p className="mb-2 text-sm font-semibold text-cocoa-700">Dias sem atendimento</p>
            <div className="flex flex-wrap gap-2">
              {WEEKDAY_NAMES.map((name, i) => {
                const closed = s.closedWeekdays.includes(i);
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => set("closedWeekdays", closed ? s.closedWeekdays.filter((d) => d !== i) : [...s.closedWeekdays, i].sort())}
                    className={cn(
                      "rounded-full px-3.5 py-2 text-sm font-semibold ring-1 transition",
                      closed ? "bg-cocoa-900 text-cream-50 ring-cocoa-900" : "bg-white text-cocoa-500 ring-cocoa-900/10",
                    )}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
            <p className="mt-1.5 text-xs text-cocoa-400">Dias marcados ficam indisponíveis no calendário do cliente.</p>
          </div>

          <div className="mt-5">
            <p className="mb-2 text-sm font-semibold text-cocoa-700">Horários de entrega/retirada</p>
            <div className="flex flex-wrap gap-2">
              {s.timeSlots.map((t) => (
                <span key={t} className="inline-flex items-center gap-1 rounded-full bg-blush-100 py-1.5 pr-1.5 pl-3 text-sm font-semibold text-rose-700">
                  {t}
                  <button type="button" onClick={() => set("timeSlots", s.timeSlots.filter((x) => x !== t))} className="grid h-5 w-5 place-items-center rounded-full hover:bg-white" aria-label={`Remover ${t}`}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="mt-2 flex max-w-sm gap-2">
              <Input placeholder="Ex.: 18h às 20h" value={slotInput} onChange={(e) => setSlotInput(e.target.value)} />
              <Button
                variant="soft"
                onClick={() => {
                  if (slotInput.trim()) set("timeSlots", [...s.timeSlots, slotInput.trim()]);
                  setSlotInput("");
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Switch checked={s.deliveryEnabled} onChange={(v) => set("deliveryEnabled", v)} label="Fazer entregas" />
            <Switch checked={s.pickupEnabled} onChange={(v) => set("pickupEnabled", v)} label="Permitir retirada" />
            {s.deliveryEnabled && (
              <Field label="Taxa de entrega (R$)" htmlFor="fee">
                <Input id="fee" inputMode="decimal" value={fee} onChange={(e) => setFee(e.target.value)} />
              </Field>
            )}
          </div>
        </Section>

        <Section title="Seção “Sobre mim”">
          <div className="grid gap-5 sm:grid-cols-[180px_1fr]">
            <div>
              <button type="button" onClick={() => fileRef.current?.click()} className="group relative block aspect-[4/5] w-full overflow-hidden rounded-2xl">
                <ProductImage src={s.about.image} alt="Foto sobre" sizes="180px" />
                <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-cocoa-900/50 text-xs font-bold text-white opacity-0 transition group-hover:opacity-100">
                  <ImagePlus className="h-5 w-5" /> Trocar foto
                </span>
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (f) set("about", { ...s.about, image: await resizeImage(f, 900) });
                }}
              />
            </div>
            <div className="space-y-4">
              <Field label="Título" htmlFor="at"><Input id="at" value={s.about.title} onChange={(e) => set("about", { ...s.about, title: e.target.value })} /></Field>
              <Field label="Texto" htmlFor="ax"><Textarea id="ax" rows={7} value={s.about.text} onChange={(e) => set("about", { ...s.about, text: e.target.value })} /></Field>
            </div>
          </div>
        </Section>

        <Section title="Integrações">
          <div className="grid gap-3 sm:grid-cols-3">
            <Integration icon={<WhatsappIcon className="h-5 w-5" />} color="bg-[#25D366]" name="WhatsApp" status="Demonstração" text="Mensagens de pedido e confirmação são simuladas e registradas em cada encomenda." />
            <Integration icon={<InstagramIcon className="h-5 w-5" />} color="bg-linear-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]" name="Instagram" status="Demonstração" text="Feed exibido com fotos de exemplo. Conexão com a conta na próxima etapa." />
            <Integration icon={<CreditCard className="h-5 w-5" />} color="bg-cocoa-700" name="Pagamento online" status="Opcional" text="Pix e cartão (Mercado Pago / Stripe) podem ser adicionados futuramente." />
          </div>
        </Section>

        <Card className="flex flex-col items-start justify-between gap-3 border-dashed p-5 sm:flex-row sm:items-center">
          <div>
            <p className="font-bold">Dados de demonstração</p>
            <p className="text-sm text-cocoa-500">Volta produtos, pedidos e ajustes ao estado original da apresentação.</p>
          </div>
          <Button variant="outline" size="sm" onClick={reset}>
            <RotateCcw className="h-4 w-4" /> Restaurar demonstração
          </Button>
        </Card>
      </div>

      {dirty && (
        <div className="fixed inset-x-0 bottom-16 z-20 px-4 lg:hidden">
          <Button size="lg" className="w-full shadow-lift" onClick={save} loading={saving}>
            Salvar alterações
          </Button>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className="p-5 sm:p-6">
      <h2 className="mb-5 text-lg font-medium">{title}</h2>
      {children}
    </Card>
  );
}

function Integration({ icon, color, name, status, text }: { icon: ReactNode; color: string; name: string; status: string; text: string }) {
  return (
    <div className="rounded-2xl border border-cocoa-900/[0.08] p-4">
      <div className="flex items-center justify-between">
        <span className={cn("grid h-10 w-10 place-items-center rounded-xl text-white", color)}>{icon}</span>
        <Badge tone="gold">{status}</Badge>
      </div>
      <p className="mt-3 font-bold">{name}</p>
      <p className="mt-1 text-xs leading-relaxed text-cocoa-500">{text}</p>
    </div>
  );
}
