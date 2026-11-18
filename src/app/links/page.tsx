"use client";

import Link from "next/link";
import { ArrowUpRight, CakeSlice, MapPin, PackageSearch, ShoppingBag } from "lucide-react";
import { FlowerMark } from "@/components/brand";
import { InstagramIcon, WhatsappIcon } from "@/components/icons";
import { useSettings } from "@/data/hooks";
import { whatsappLink } from "@/features/notifications/whatsapp";

/**
 * Página "link na bio" para o Instagram: flordeacucar.com.br/links
 * Leva o seguidor direto para o pedido, sem depender de ferramentas de terceiros.
 */
export default function LinksPage() {
  const { data: s } = useSettings();
  const links = [
    { href: "/cardapio", label: "Fazer meu pedido", icon: ShoppingBag, primary: true },
    { href: "/cardapio#cat-bolos", label: "Ver bolos e preços", icon: CakeSlice },
    { href: "/acompanhar", label: "Acompanhar meu pedido", icon: PackageSearch },
    ...(s
      ? [
          { href: whatsappLink(s.whatsapp, "Olá! Vim pelo Instagram 🌸"), label: "Falar no WhatsApp", icon: WhatsappIcon, external: true },
          { href: `https://maps.google.com/?q=${encodeURIComponent(s.pickupAddress)}`, label: "Como chegar", icon: MapPin, external: true },
        ]
      : []),
  ];

  return (
    <main className="relative flex min-h-dvh flex-col items-center overflow-hidden bg-linear-to-b from-blush-100 via-cream-100 to-cream-100 px-4 py-12">
      <div className="pointer-events-none absolute -top-24 h-72 w-72 rounded-full bg-blush-200/70 blur-3xl" />
      <div className="relative grid h-24 w-24 place-items-center rounded-full bg-white shadow-lift ring-4 ring-white">
        <FlowerMark className="h-14 w-14 text-rose-400" />
      </div>
      <h1 className="relative mt-4 text-3xl font-medium italic">Flor de Açúcar</h1>
      <p className="relative text-sm font-semibold text-cocoa-500">Ateliê de doces · encomendas</p>
      {s && (
        <a href={`https://instagram.com/${s.instagram}`} target="_blank" rel="noreferrer" className="relative mt-2 inline-flex items-center gap-1 text-sm font-bold text-rose-600">
          <InstagramIcon className="h-4 w-4" /> @{s.instagram}
        </a>
      )}

      <ul className="relative mt-8 w-full max-w-sm space-y-3">
        {links.map((l) => {
          const cls = `flex items-center gap-3 rounded-2xl px-5 py-4 font-bold shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift ${
            l.primary ? "bg-rose-500 text-white" : "bg-white text-cocoa-900"
          }`;
          const content = (
            <>
              <l.icon className="h-5 w-5 shrink-0" />
              <span className="flex-1 text-center">{l.label}</span>
              <ArrowUpRight className="h-4 w-4 shrink-0 opacity-50" />
            </>
          );
          return (
            <li key={l.label}>
              {"external" in l && l.external ? (
                <a href={l.href} target="_blank" rel="noreferrer" className={cls}>{content}</a>
              ) : (
                <Link href={l.href} className={cls}>{content}</Link>
              )}
            </li>
          );
        })}
      </ul>
      <Link href="/" className="relative mt-10 text-xs font-semibold text-cocoa-400 hover:text-rose-600">
        flordeacucar.com.br
      </Link>
    </main>
  );
}
