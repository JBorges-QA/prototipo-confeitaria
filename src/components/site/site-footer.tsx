"use client";

import Link from "next/link";
import { Clock, Mail, MapPin, MessageCircle } from "lucide-react";
import { InstagramIcon, WhatsappIcon } from "@/components/icons";
import { Logo } from "@/components/brand";
import { useSettings } from "@/data/hooks";
import { whatsappLink } from "@/features/notifications/whatsapp";
import { formatPhone } from "@/lib/utils";

export function SiteFooter() {
  const { data: s } = useSettings();
  return (
    <footer className="mt-auto bg-cocoa-900 text-cream-200">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4 lg:col-span-2">
          <Logo light />
          <p className="max-w-sm text-sm leading-relaxed text-cream-300/80">
            Bolos e doces artesanais feitos à mão, em pequenas fornadas, para adoçar os seus momentos mais especiais.
          </p>
          <div className="flex gap-2">
            {s && (
              <>
                <a href={`https://instagram.com/${s.instagram}`} target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Instagram">
                  <InstagramIcon className="h-[18px] w-[18px]" />
                </a>
                <a href={whatsappLink(s.whatsapp)} target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="WhatsApp">
                  <WhatsappIcon className="h-[18px] w-[18px]" />
                </a>
              </>
            )}
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold tracking-[0.18em] text-gold-300 uppercase" style={{ fontFamily: "var(--font-sans)" }}>
            Navegue
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link className="hover:text-white" href="/cardapio">Cardápio</Link></li>
            <li><Link className="hover:text-white" href="/acompanhar">Acompanhar pedido</Link></li>
            <li><Link className="hover:text-white" href="/#sobre">Sobre</Link></li>
            <li><Link className="hover:text-white" href="/links">Links (Instagram)</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold tracking-[0.18em] text-gold-300 uppercase" style={{ fontFamily: "var(--font-sans)" }}>
            Contato
          </h4>
          {s && (
            <ul className="space-y-3 text-sm text-cream-300/90">
              <li className="flex gap-2.5"><MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />{formatPhone(s.whatsapp)}</li>
              <li className="flex gap-2.5"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />{s.email}</li>
              <li className="flex gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />{s.pickupAddress}</li>
              <li className="flex gap-2.5"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />{s.openingHours}</li>
            </ul>
          )}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-cream-300/60 sm:flex-row">
          <p>© {new Date().getFullYear()} Flor de Açúcar · Ateliê de Doces</p>
          <Link href="/admin" className="hover:text-cream-100">Área da confeitaria</Link>
        </div>
      </div>
    </footer>
  );
}
