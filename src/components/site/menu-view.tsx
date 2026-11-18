"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import type { Product } from "@/domain/catalog";
import { useCategories, useProducts, useSettings } from "@/data/hooks";
import { WEEKDAY_NAMES } from "@/lib/dates";
import { cn, formatCurrency } from "@/lib/utils";
import { EmptyState, Skeleton } from "@/components/ui/misc";
import { ProductCard } from "./product-card";
import { ProductSheet } from "./product-sheet";

export function MenuView() {
  const { data: categories } = useCategories();
  const { data: products } = useProducts();
  const { data: settings } = useSettings();
  const [selected, setSelected] = useState<Product | null>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string>("");
  const tabsRef = useRef<HTMLDivElement>(null);

  const groups = useMemo(() => {
    if (!categories || !products) return [];
    const q = query.trim().toLowerCase();
    return categories
      .map((c) => ({
        category: c,
        items: products.filter(
          (p) =>
            p.categoryId === c.id &&
            (!q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.flavors.some((f) => f.toLowerCase().includes(q))),
        ),
      }))
      .filter((g) => g.items.length > 0);
  }, [categories, products, query]);

  // Scroll-spy: destaca a categoria visível
  useEffect(() => {
    if (!groups.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-140px 0px -55% 0px" },
    );
    groups.forEach((g) => {
      const el = document.getElementById(g.category.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [groups]);

  useEffect(() => {
    const el = tabsRef.current?.querySelector<HTMLElement>(`[data-cat="${active}"]`);
    el?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [active]);

  const closedDays = settings?.closedWeekdays.map((d) => WEEKDAY_NAMES[d].toLowerCase()).join(" e ");

  return (
    <div className="pb-24">
      <section className="container-page pt-6 pb-6 sm:pt-10">
        <p className="mb-2 text-xs font-bold tracking-[0.22em] text-rose-500 uppercase">Cardápio</p>
        <h1 className="text-4xl font-medium sm:text-5xl">Escolha suas delícias</h1>
        {settings && (
          <p className="mt-3 max-w-2xl text-cocoa-500">
            Encomendas com no mínimo <strong className="text-cocoa-700">{settings.minLeadDays} dias</strong> de antecedência.
            Pedido mínimo de {formatCurrency(settings.minOrderValue)}.{closedDays && ` Não atendemos ${closedDays}.`}
          </p>
        )}
      </section>

      <div className="sticky top-16 z-20 border-y border-cocoa-900/[0.06] bg-cream-100/95 backdrop-blur-md sm:top-[4.5rem]">
        <div className="container-page flex items-center gap-3 py-2.5">
          <label className="relative hidden w-64 shrink-0 md:block">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-cocoa-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar doce ou sabor…"
              className="h-10 w-full rounded-full border border-cocoa-900/10 bg-white pr-3 pl-9 text-sm focus:border-rose-400 focus:outline-none"
            />
          </label>
          <div ref={tabsRef} className="scrollbar-none flex gap-1.5 overflow-x-auto">
            {groups.map(({ category }) => (
              <a
                key={category.id}
                data-cat={category.id}
                href={`#${category.id}`}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition",
                  active === category.id ? "bg-cocoa-900 text-cream-50" : "text-cocoa-700 hover:bg-cocoa-900/5",
                )}
              >
                {category.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="container-page mt-4 md:hidden">
        <label className="relative block">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-cocoa-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar doce ou sabor…"
            className="h-11 w-full rounded-full border border-cocoa-900/10 bg-white pr-10 pl-10 text-[0.95rem] focus:border-rose-400 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute top-1/2 right-3 -translate-y-1/2 text-cocoa-400" aria-label="Limpar busca">
              <X className="h-4 w-4" />
            </button>
          )}
        </label>
      </div>

      <div className="container-page mt-6 space-y-12">
        {!products &&
          Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, j) => (
                  <Skeleton key={j} className="aspect-[3/4] rounded-2xl" />
                ))}
              </div>
            </div>
          ))}

        {products && groups.length === 0 && (
          <EmptyState icon={<Search className="h-6 w-6" />} title="Nada encontrado" description={`Não encontramos itens para “${query}”.`} />
        )}

        {groups.map(({ category, items }) => (
          <section key={category.id} id={category.id} className="scroll-mt-36">
            <div className="mb-4 flex items-baseline justify-between gap-3">
              <div>
                <h2 className="text-2xl font-medium sm:text-3xl">{category.name}</h2>
                {category.description && <p className="mt-0.5 text-sm text-cocoa-400">{category.description}</p>}
              </div>
              <span className="text-xs font-semibold text-cocoa-400">{items.length} itens</span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {items.map((p) => (
                <ProductCard key={p.id} product={p} onSelect={setSelected} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <ProductSheet product={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
