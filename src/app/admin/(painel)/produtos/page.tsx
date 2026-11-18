"use client";

import { routes } from "@/config/routes";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Eye, EyeOff, Pencil, Plus, Search, Star, Tags, Trash2 } from "lucide-react";
import { getDataSource } from "@/data";
import { useCategories, useProducts } from "@/data/hooks";
import type { Product } from "@/domain/catalog";
import { priceSuffix } from "@/features/orders/pricing";
import { cn, formatCurrency } from "@/lib/utils";
import { PageHeader } from "@/components/admin/admin-shell";
import { CategoriesManager } from "@/components/admin/categories-manager";
import { ProductImage } from "@/components/product-image";
import { ButtonLink, Button } from "@/components/ui/button";
import { Badge, Card, EmptyState, Skeleton } from "@/components/ui/misc";
import { useToast } from "@/components/ui/toast";

export default function ProductsAdminPage() {
  const toast = useToast();
  const { data: products } = useProducts(true);
  const { data: categories } = useCategories();
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const [showCategories, setShowCategories] = useState(false);

  const list = useMemo(
    () =>
      (products ?? []).filter(
        (p) => (cat === "all" || p.categoryId === cat) && (!q || p.name.toLowerCase().includes(q.toLowerCase())),
      ),
    [products, cat, q],
  );
  const catName = (id: string) => categories?.find((c) => c.id === id)?.name ?? "—";

  async function toggle(p: Product, field: "active" | "featured") {
    const { id, slug: _s, updatedAt: _u, ...rest } = p;
    void _s; void _u;
    await getDataSource().catalog.saveProduct({ ...rest, id, [field]: !p[field] });
    toast(field === "active" ? (p.active ? "Produto ocultado do cardápio" : "Produto visível no cardápio") : p.featured ? "Removido dos destaques" : "Adicionado aos destaques");
  }

  async function remove(p: Product) {
    if (!confirm(`Excluir “${p.name}”? Esta ação não pode ser desfeita.`)) return;
    await getDataSource().catalog.deleteProduct(p.id);
    toast("Produto excluído");
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Cardápio"
        description={products ? `${products.length} produtos · ${products.filter((p) => p.active).length} visíveis no site` : "Carregando…"}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => setShowCategories(true)}>
              <Tags className="h-4 w-4" /> Categorias
            </Button>
            <ButtonLink href="/admin/produtos/novo" size="sm">
              <Plus className="h-4 w-4" /> Novo produto
            </ButtonLink>
          </>
        }
      />

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="relative lg:w-72">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-cocoa-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar produto"
            className="h-11 w-full rounded-full border border-cocoa-900/10 bg-white pr-4 pl-10 text-sm focus:border-rose-400 focus:outline-none"
          />
        </label>
        <div className="scrollbar-none -mx-4 flex gap-1.5 overflow-x-auto px-4 lg:mx-0 lg:px-0">
          {[{ id: "all", name: "Todos" }, ...(categories ?? [])].map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-2 text-sm font-semibold transition",
                cat === c.id ? "bg-cocoa-900 text-cream-50" : "bg-white text-cocoa-500 ring-1 ring-cocoa-900/10 hover:text-cocoa-900",
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <Card className="overflow-hidden">
        {!products ? (
          <div className="space-y-3 p-5">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
        ) : list.length === 0 ? (
          <EmptyState title="Nenhum produto" description="Cadastre o primeiro produto desta categoria." action={<ButtonLink href="/admin/produtos/novo">Novo produto</ButtonLink>} />
        ) : (
          <ul className="divide-y divide-cocoa-900/[0.06]">
            {list.map((p) => (
              <li key={p.id} className={cn("flex items-center gap-3 px-4 py-3 sm:gap-4 sm:px-5", !p.active && "opacity-55")}>
                <Link href={routes.adminProduct(p.id)} className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                  <ProductImage src={p.images[0]} alt={p.name} sizes="56px" />
                </Link>
                <Link href={routes.adminProduct(p.id)} className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 truncate font-bold">
                    {p.name}
                    {p.featured && <Star className="h-3.5 w-3.5 shrink-0 fill-gold-500 text-gold-500" />}
                  </p>
                  <p className="text-xs text-cocoa-400">
                    {catName(p.categoryId)} · <span className="font-bold text-cocoa-700">{formatCurrency(p.price)}{priceSuffix(p.unit)}</span>
                  </p>
                </Link>
                {!p.active && <Badge tone="muted" className="hidden sm:inline-flex">Oculto</Badge>}
                <div className="flex shrink-0 items-center">
                  <IconBtn label={p.featured ? "Remover destaque" : "Destacar na home"} onClick={() => toggle(p, "featured")} className="hidden sm:grid">
                    <Star className={cn("h-4 w-4", p.featured && "fill-gold-500 text-gold-500")} />
                  </IconBtn>
                  <IconBtn label={p.active ? "Ocultar do cardápio" : "Mostrar no cardápio"} onClick={() => toggle(p, "active")}>
                    {p.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </IconBtn>
                  <Link href={routes.adminProduct(p.id)} className="grid h-9 w-9 place-items-center rounded-full text-cocoa-500 hover:bg-cocoa-900/5" aria-label="Editar">
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <IconBtn label="Excluir" onClick={() => remove(p)} className="hidden hover:text-red-600 sm:grid">
                    <Trash2 className="h-4 w-4" />
                  </IconBtn>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <CategoriesManager open={showCategories} onClose={() => setShowCategories(false)} />
    </div>
  );
}

function IconBtn({ label, onClick, children, className }: { label: string; onClick: () => void; children: React.ReactNode; className?: string }) {
  return (
    <button onClick={onClick} title={label} aria-label={label} className={cn("grid h-9 w-9 place-items-center rounded-full text-cocoa-500 hover:bg-cocoa-900/5", className)}>
      {children}
    </button>
  );
}
