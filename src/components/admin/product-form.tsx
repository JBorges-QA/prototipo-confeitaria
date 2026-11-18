"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ImagePlus, Loader2, Star, Trash2, X } from "lucide-react";
import { getDataSource } from "@/data";
import { useCategories } from "@/data/hooks";
import { productSchema, type Product, type ProductInput } from "@/domain/catalog";
import { resizeImage } from "@/lib/image";
import { centsToInput, cn, parseCurrencyToCents } from "@/lib/utils";
import { ProductImage } from "@/components/product-image";
import { ProductCard } from "@/components/site/product-card";
import { Button, ButtonLink } from "@/components/ui/button";
import { Field, Input, Select, Switch, Textarea } from "@/components/ui/form";
import { Card } from "@/components/ui/misc";
import { useToast } from "@/components/ui/toast";

const UNITS = [
  { value: "kg", label: "Quilo (kg)" },
  { value: "unidade", label: "Unidade" },
  { value: "cento", label: "Cento" },
  { value: "caixa", label: "Caixa" },
  { value: "fatia", label: "Fatia" },
];

type Draft = {
  name: string;
  description: string;
  categoryId: string;
  price: string;
  unit: string;
  minQuantity: string;
  quantityStep: string;
  flavors: string[];
  tags: string;
  images: string[];
  featured: boolean;
  active: boolean;
};

const toDraft = (p?: Product): Draft => ({
  name: p?.name ?? "",
  description: p?.description ?? "",
  categoryId: p?.categoryId ?? "",
  price: p ? centsToInput(p.price) : "",
  unit: p?.unit ?? "unidade",
  minQuantity: String(p?.minQuantity ?? 1).replace(".", ","),
  quantityStep: String(p?.quantityStep ?? 1).replace(".", ","),
  flavors: p?.flavors ?? [],
  tags: p?.tags.join(", ") ?? "",
  images: p?.images ?? [],
  featured: p?.featured ?? false,
  active: p?.active ?? true,
});

const num = (s: string) => Number.parseFloat(s.replace(",", ".")) || 0;

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const toast = useToast();
  const { data: categories } = useCategories();
  const [d, setD] = useState<Draft>(() => toDraft(product));
  const [flavorInput, setFlavorInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => {
    setD((prev) => ({ ...prev, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  const categoryId = d.categoryId || categories?.[0]?.id || "";

  const toInput = (): ProductInput => ({
    id: product?.id,
    name: d.name.trim(),
    description: d.description.trim(),
    categoryId,
    price: parseCurrencyToCents(d.price),
    unit: d.unit,
    minQuantity: num(d.minQuantity),
    quantityStep: num(d.quantityStep),
    flavors: d.flavors,
    tags: d.tags.split(",").map((t) => t.trim()).filter(Boolean),
    images: d.images,
    featured: d.featured,
    active: d.active,
    sortOrder: product?.sortOrder ?? 999,
  });

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    try {
      const urls = await Promise.all([...files].slice(0, 6).map((f) => resizeImage(f)));
      setD((prev) => ({ ...prev, images: [...prev.images, ...urls].slice(0, 6) }));
    } catch (e) {
      toast(e instanceof Error ? e.message : "Erro ao carregar imagem", "error");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function addFlavor() {
    const v = flavorInput.trim();
    if (v && !d.flavors.includes(v)) set("flavors", [...d.flavors, v]);
    setFlavorInput("");
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    const input = toInput();
    const parsed = productSchema
      .omit({ id: true, slug: true, updatedAt: true })
      .safeParse(input);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[String(i.path[0])] ??= i.message));
      setErrors(errs);
      toast("Revise os campos destacados", "error");
      return;
    }
    setSaving(true);
    try {
      await getDataSource().catalog.saveProduct(input);
      toast(product ? "Produto atualizado" : "Produto cadastrado");
      router.push("/admin/produtos");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erro ao salvar", "error");
      setSaving(false);
    }
  }

  async function remove() {
    if (!product || !confirm(`Excluir “${product.name}”?`)) return;
    await getDataSource().catalog.deleteProduct(product.id);
    toast("Produto excluído");
    router.push("/admin/produtos");
  }

  const preview: Product = {
    ...toInput(),
    id: product?.id ?? "preview",
    slug: "",
    updatedAt: "",
    name: d.name || "Nome do produto",
    description: d.description || "Descrição do produto",
    price: parseCurrencyToCents(d.price) || 0,
  };

  return (
    <form onSubmit={submit} noValidate className="mx-auto max-w-6xl">
      <ButtonLink href="/admin/produtos" variant="ghost" size="sm" className="-ml-3">
        <ArrowLeft className="h-4 w-4" /> Cardápio
      </ButtonLink>
      <div className="mt-2 mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-medium sm:text-3xl">{product ? "Editar produto" : "Novo produto"}</h1>
        <div className="flex gap-2">
          {product && (
            <Button variant="ghost" size="sm" onClick={remove} className="text-red-600 hover:bg-red-50">
              <Trash2 className="h-4 w-4" /> Excluir
            </Button>
          )}
          <Button type="submit" loading={saving}>
            Salvar produto
          </Button>
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <Card className="space-y-4 p-5">
            <h2 className="text-lg font-medium">Fotos</h2>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {d.images.map((src, i) => (
                <div key={i} className="group relative aspect-square overflow-hidden rounded-xl border border-cocoa-900/10">
                  <ProductImage src={src} alt={`Foto ${i + 1}`} sizes="160px" />
                  {i === 0 && <span className="absolute bottom-1.5 left-1.5 rounded-full bg-white/95 px-2 py-0.5 text-[0.65rem] font-bold">Capa</span>}
                  <div className="absolute top-1.5 right-1.5 flex gap-1">
                    {i > 0 && (
                      <button
                        type="button"
                        title="Usar como capa"
                        onClick={() => set("images", [src, ...d.images.filter((_, j) => j !== i)])}
                        className="grid h-7 w-7 place-items-center rounded-full bg-white/95 text-cocoa-700 shadow"
                      >
                        <Star className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      title="Remover"
                      onClick={() => set("images", d.images.filter((_, j) => j !== i))}
                      className="grid h-7 w-7 place-items-center rounded-full bg-white/95 text-red-600 shadow"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              {d.images.length < 6 && (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-cocoa-900/15 text-cocoa-400 transition hover:border-rose-400 hover:text-rose-600"
                >
                  {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <ImagePlus className="h-6 w-6" />}
                  <span className="text-xs font-semibold">Adicionar</span>
                </button>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => onFiles(e.target.files)} />
            <p className="text-xs text-cocoa-400">Até 6 fotos. A primeira é a capa. Imagens são redimensionadas automaticamente.</p>
          </Card>

          <Card className="space-y-4 p-5">
            <h2 className="text-lg font-medium">Informações</h2>
            <Field label="Nome" error={errors.name} htmlFor="name">
              <Input id="name" value={d.name} onChange={(e) => set("name", e.target.value)} aria-invalid={!!errors.name} placeholder="Ex.: Bolo Red Velvet" />
            </Field>
            <Field label="Descrição" error={errors.description} hint={`${d.description.length}/400`} htmlFor="desc">
              <Textarea id="desc" value={d.description} onChange={(e) => set("description", e.target.value)} maxLength={400} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Categoria" error={errors.categoryId} htmlFor="cat">
                <Select id="cat" value={categoryId} onChange={(e) => set("categoryId", e.target.value)}>
                  {(categories ?? []).map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Etiquetas" hint="Separadas por vírgula (ex.: novidade, sem lactose)" htmlFor="tags">
                <Input id="tags" value={d.tags} onChange={(e) => set("tags", e.target.value)} />
              </Field>
            </div>
          </Card>

          <Card className="space-y-4 p-5">
            <h2 className="text-lg font-medium">Preço e quantidade</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Preço (R$)" error={errors.price} htmlFor="price">
                <div className="relative">
                  <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-sm font-semibold text-cocoa-400">R$</span>
                  <Input id="price" inputMode="decimal" className="pl-10" value={d.price} onChange={(e) => set("price", e.target.value)} aria-invalid={!!errors.price} placeholder="0,00" />
                </div>
              </Field>
              <Field label="Vendido por" htmlFor="unit">
                <Select id="unit" value={d.unit} onChange={(e) => set("unit", e.target.value)}>
                  {UNITS.map((u) => (
                    <option key={u.value} value={u.value}>{u.label}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Quantidade mínima" error={errors.minQuantity} htmlFor="min">
                <Input id="min" inputMode="decimal" value={d.minQuantity} onChange={(e) => set("minQuantity", e.target.value)} />
              </Field>
              <Field label="Aumenta de quanto em quanto" error={errors.quantityStep} hint="Ex.: 0,5 kg ou 5 unidades" htmlFor="step">
                <Input id="step" inputMode="decimal" value={d.quantityStep} onChange={(e) => set("quantityStep", e.target.value)} />
              </Field>
            </div>
          </Card>

          <Card className="space-y-3 p-5">
            <h2 className="text-lg font-medium">Sabores / recheios</h2>
            <p className="text-sm text-cocoa-500">Opções que o cliente pode escolher. Deixe vazio se não houver.</p>
            <div className="flex flex-wrap gap-2">
              {d.flavors.map((f) => (
                <span key={f} className="inline-flex items-center gap-1 rounded-full bg-blush-100 py-1.5 pr-1.5 pl-3 text-sm font-semibold text-rose-700">
                  {f}
                  <button type="button" onClick={() => set("flavors", d.flavors.filter((x) => x !== f))} className="grid h-5 w-5 place-items-center rounded-full hover:bg-white" aria-label={`Remover ${f}`}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={flavorInput}
                onChange={(e) => setFlavorInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addFlavor();
                  }
                }}
                placeholder="Ex.: Ninho com morango"
              />
              <Button variant="soft" onClick={addFlavor}>Adicionar</Button>
            </div>
          </Card>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-8">
          <Switch checked={d.active} onChange={(v) => set("active", v)} label="Visível no cardápio" description="Desative para pausar a venda sem excluir" />
          <Switch checked={d.featured} onChange={(v) => set("featured", v)} label="Destaque na página inicial" />
          <div>
            <p className="mb-2 text-xs font-bold tracking-wider text-cocoa-400 uppercase">Pré-visualização</p>
            <div className={cn("pointer-events-none max-w-[260px]", !d.active && "opacity-50")}>
              <ProductCard product={preview} onSelect={() => {}} />
            </div>
          </div>
        </aside>
      </div>
    </form>
  );
}
