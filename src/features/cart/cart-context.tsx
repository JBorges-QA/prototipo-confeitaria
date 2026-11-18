"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { storageNamespace } from "@/config/site";
import type { Product } from "@/domain/catalog";
import { lineTotal } from "@/features/orders/pricing";

export interface CartItem {
  key: string;
  productId: string;
  name: string;
  unit: string;
  unitPrice: number;
  quantity: number;
  minQuantity: number;
  quantityStep: number;
  flavor?: string;
  image?: string;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  ready: boolean;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (product: Product, quantity: number, flavor?: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = `${storageNamespace}:cart`;

const round = (n: number) => Math.round(n * 100) / 100;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hidratação do carrinho salvo
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignora */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignora */
    }
  }, [items, ready]);

  const add = useCallback((product: Product, quantity: number, flavor?: string) => {
    const key = `${product.id}::${flavor ?? ""}`;
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, quantity: round(i.quantity + quantity) } : i));
      }
      return [
        ...prev,
        {
          key,
          productId: product.id,
          name: product.name,
          unit: product.unit,
          unitPrice: product.price,
          quantity,
          minQuantity: product.minQuantity,
          quantityStep: product.quantityStep,
          flavor,
          image: product.images[0],
        },
      ];
    });
  }, []);

  const setQuantity = useCallback((key: string, quantity: number) => {
    setItems((prev) =>
      prev.flatMap((i) => {
        if (i.key !== key) return [i];
        if (quantity < i.minQuantity) return [];
        return [{ ...i, quantity: round(quantity) }];
      }),
    );
  }, []);

  const remove = useCallback((key: string) => setItems((prev) => prev.filter((i) => i.key !== key)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.length,
      subtotal: items.reduce((s, i) => s + lineTotal(i), 0),
      ready,
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
      add,
      setQuantity,
      remove,
      clear,
    }),
    [items, ready, isOpen, add, setQuantity, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de <CartProvider>");
  return ctx;
}
