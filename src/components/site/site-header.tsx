"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { Logo } from "@/components/brand";
import { ButtonLink } from "@/components/ui/button";
import { useCart } from "@/features/cart/cart-context";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Início" },
  { href: "/cardapio", label: "Cardápio" },
  { href: "/#sobre", label: "Sobre" },
  { href: "/#depoimentos", label: "Depoimentos" },
  { href: "/acompanhar", label: "Acompanhar pedido" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const cart = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- fecha o menu ao navegar
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        scrolled || menuOpen ? "border-b border-cocoa-900/[0.06] bg-cream-50/90 backdrop-blur-md" : "bg-transparent",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4 sm:h-[4.5rem]">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-3.5 py-2 text-sm font-semibold transition-colors",
                pathname === item.href ? "text-rose-600" : "text-cocoa-700 hover:text-rose-600",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <ButtonLink href="/cardapio" size="sm" className="hidden sm:inline-flex">
            Fazer pedido
          </ButtonLink>
          <button
            onClick={cart.open}
            className="relative grid h-10 w-10 place-items-center rounded-full text-cocoa-900 transition hover:bg-cocoa-900/5"
            aria-label={`Abrir pedido (${cart.count} itens)`}
          >
            <ShoppingBag className="h-5 w-5" />
            {cart.count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[0.68rem] font-bold text-white ring-2 ring-cream-50">
                {cart.count}
              </span>
            )}
          </button>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full text-cocoa-900 hover:bg-cocoa-900/5 lg:hidden"
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="container-page animate-fade-up pb-5 lg:hidden">
          <ul className="divide-y divide-cocoa-900/[0.06] rounded-2xl border border-cocoa-900/[0.07] bg-white">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={() => setMenuOpen(false)} className="block px-4 py-3.5 font-semibold text-cocoa-700">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
