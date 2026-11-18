"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/features/cart/cart-context";
import { lineTotal } from "@/features/orders/pricing";
import { formatCurrency } from "@/lib/utils";
import { ProductImage } from "@/components/product-image";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/misc";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { Sheet } from "@/components/ui/sheet";

export function CartLines({ compact = false }: { compact?: boolean }) {
  const cart = useCart();
  return (
    <ul className="divide-y divide-cocoa-900/[0.06]">
      {cart.items.map((item) => (
        <li key={item.key} className="flex gap-3 py-3.5">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
            <ProductImage src={item.image} alt={item.name} sizes="64px" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-semibold text-cocoa-900">{item.name}</p>
                {item.flavor && <p className="text-xs text-cocoa-400">{item.flavor}</p>}
              </div>
              <button
                onClick={() => cart.remove(item.key)}
                className="-mt-1 -mr-1 grid h-8 w-8 shrink-0 place-items-center rounded-full text-cocoa-400 hover:bg-red-50 hover:text-red-600"
                aria-label={`Remover ${item.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-2 flex items-center justify-between gap-2">
              <QuantityStepper
                size="sm"
                value={item.quantity}
                min={item.minQuantity}
                step={item.quantityStep}
                onChange={(v) => cart.setQuantity(item.key, v)}
                suffix={item.unit === "kg" ? "kg" : undefined}
              />
              <span className={compact ? "text-sm font-bold" : "font-bold"}>{formatCurrency(lineTotal(item))}</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function CartSheet() {
  const cart = useCart();
  return (
    <Sheet
      open={cart.isOpen}
      onClose={cart.close}
      title="Seu pedido"
      footer={
        cart.items.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-cocoa-500">Subtotal</span>
              <span className="text-lg font-extrabold">{formatCurrency(cart.subtotal)}</span>
            </div>
            <ButtonLink href="/pedido" size="lg" className="w-full" onClick={cart.close}>
              Escolher data e finalizar <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
        )
      }
    >
      <div className="px-5">
        {cart.items.length === 0 ? (
          <EmptyState
            icon={<ShoppingBag className="h-6 w-6" />}
            title="Seu pedido está vazio"
            description="Explore o cardápio e adicione bolos e doces para a sua celebração."
            action={
              <ButtonLink href="/cardapio" onClick={cart.close}>
                Ver cardápio
              </ButtonLink>
            }
          />
        ) : (
          <>
            <CartLines />
            <Link href="/cardapio" onClick={cart.close} className="mb-4 inline-block text-sm font-semibold text-rose-600">
              + Adicionar mais itens
            </Link>
          </>
        )}
      </div>
    </Sheet>
  );
}

/** Barra fixa no rodapé (mobile) com resumo do pedido. */
export function FloatingCartBar() {
  const cart = useCart();
  const pathname = usePathname();
  if (!cart.ready || cart.count === 0 || pathname.startsWith("/pedido")) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 px-3 pb-safe sm:hidden">
      <button
        onClick={cart.open}
        className="flex w-full animate-fade-up items-center justify-between rounded-2xl bg-cocoa-900 px-4 py-3.5 text-cream-50 shadow-lift"
      >
        <span className="flex items-center gap-2.5 font-semibold">
          <span className="grid h-7 min-w-7 place-items-center rounded-full bg-rose-500 px-1.5 text-xs font-bold">{cart.count}</span>
          Ver meu pedido
        </span>
        <span className="font-extrabold">{formatCurrency(cart.subtotal)}</span>
      </button>
    </div>
  );
}
