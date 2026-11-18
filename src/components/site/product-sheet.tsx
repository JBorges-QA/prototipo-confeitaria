"use client";

import { useState } from "react";
import { ShoppingBag, X } from "lucide-react";
import type { Product } from "@/domain/catalog";
import { useCart } from "@/features/cart/cart-context";
import { priceSuffix, unitLabel } from "@/features/orders/pricing";
import { cn, formatCurrency, formatQuantity } from "@/lib/utils";
import { ProductImage } from "@/components/product-image";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { Sheet } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/toast";

export function ProductSheet({ product, onClose }: { product: Product | null; onClose: () => void }) {
  return (
    <Sheet open={!!product} onClose={onClose} variant="dialog">
      {product && <ProductSheetBody key={product.id} product={product} onClose={onClose} />}
    </Sheet>
  );
}

function ProductSheetBody({ product, onClose }: { product: Product; onClose: () => void }) {
  const cart = useCart();
  const toast = useToast();
  const [qty, setQty] = useState(product.minQuantity);
  const [flavor, setFlavor] = useState<string | undefined>(product.flavors[0]);
  const total = Math.round(product.price * qty);

  const add = () => {
    cart.add(product, qty, flavor);
    toast(`${product.name} adicionado ao pedido`);
    onClose();
  };

  return (
    <div className="flex flex-col">
      <div className="relative mx-4 mt-1 aspect-[16/11] overflow-hidden rounded-2xl sm:mx-5 sm:mt-0">
        <ProductImage src={product.images[0]} alt={product.name} sizes="560px" priority />
        <button
          onClick={onClose}
          className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-cocoa-700 shadow-soft backdrop-blur hover:bg-white"
          aria-label="Fechar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="space-y-5 px-5 pt-5 pb-4">
        <div>
          <h2 className="text-2xl leading-tight font-medium">{product.name}</h2>
          <p className="mt-1.5 text-lg font-extrabold text-rose-600">
            {formatCurrency(product.price)}
            <span className="text-sm font-semibold text-cocoa-400">{priceSuffix(product.unit)}</span>
          </p>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-cocoa-500">{product.description}</p>
        </div>

        {product.flavors.length > 0 && (
          <fieldset>
            <legend className="mb-2 text-sm font-bold text-cocoa-700">
              {product.categoryId === "cat-bolos" ? "Recheio" : "Sabor"}
            </legend>
            <div className="flex flex-wrap gap-2">
              {product.flavors.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFlavor(f)}
                  className={cn(
                    "rounded-full border px-3.5 py-2 text-sm font-semibold transition",
                    flavor === f
                      ? "border-rose-500 bg-rose-500 text-white"
                      : "border-cocoa-900/12 bg-white text-cocoa-700 hover:border-rose-400",
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        <div className="flex items-center justify-between gap-4 rounded-2xl bg-cream-100 p-3.5">
          <div>
            <p className="text-sm font-bold text-cocoa-700">Quantidade</p>
            <p className="text-xs text-cocoa-400">
              mínimo {formatQuantity(product.minQuantity)} {unitLabel(product.unit, product.minQuantity)}
            </p>
          </div>
          <QuantityStepper
            value={qty}
            min={product.minQuantity}
            step={product.quantityStep}
            onChange={setQty}
            suffix={product.unit === "kg" ? "kg" : undefined}
          />
        </div>
      </div>
      <div className="sticky bottom-0 border-t border-cocoa-900/10 bg-white px-5 pt-4 pb-safe">
        <Button size="lg" className="w-full justify-between" onClick={add}>
          <span className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" /> Adicionar ao pedido
          </span>
          <span>{formatCurrency(total)}</span>
        </Button>
      </div>
    </div>
  );
}
