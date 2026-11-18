"use client";

import { Plus } from "lucide-react";
import type { Product } from "@/domain/catalog";
import { priceSuffix, unitLabel } from "@/features/orders/pricing";
import { formatCurrency, formatQuantity } from "@/lib/utils";
import { ProductImage } from "@/components/product-image";
import { Badge } from "@/components/ui/misc";

export function ProductCard({ product, onSelect }: { product: Product; onSelect: (p: Product) => void }) {
  return (
    <button
      onClick={() => onSelect(product)}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-cocoa-900/[0.06] bg-white text-left shadow-soft transition duration-300 hover:-translate-y-0.5 hover:shadow-lift"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-square">
        <ProductImage src={product.images[0]} alt={product.name} className="transition duration-700 group-hover:scale-105" />
        {product.tags[0] && (
          <Badge tone="gold" className="absolute top-2.5 left-2.5 bg-white/95 capitalize shadow-sm">
            {product.tags[0]}
          </Badge>
        )}
      </div>
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <h3 className="line-clamp-2 text-[0.98rem] leading-snug font-medium text-cocoa-900 sm:text-lg">{product.name}</h3>
        <p className="mt-1 hidden line-clamp-2 text-sm text-cocoa-500 sm:block">{product.description}</p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div>
            <p className="text-[0.98rem] font-extrabold text-rose-600 sm:text-lg">
              {formatCurrency(product.price)}
              <span className="text-xs font-semibold text-cocoa-400">{priceSuffix(product.unit)}</span>
            </p>
            {product.minQuantity > 1 && (
              <p className="text-[0.7rem] text-cocoa-400 sm:text-xs">
                mín. {formatQuantity(product.minQuantity)} {unitLabel(product.unit, product.minQuantity)}
              </p>
            )}
          </div>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blush-100 text-rose-600 transition group-hover:bg-rose-500 group-hover:text-white">
            <Plus className="h-[18px] w-[18px]" />
          </span>
        </div>
      </div>
    </button>
  );
}
