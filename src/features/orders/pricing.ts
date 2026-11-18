import type { FulfillmentType, OrderItem } from "@/domain/order";
import type { BusinessSettings } from "@/domain/settings";

/** Regras de preço centralizadas (as mesmas serão usadas no servidor). */
export function lineTotal(item: Pick<OrderItem, "unitPrice" | "quantity">) {
  return Math.round(item.unitPrice * item.quantity);
}

export function computeTotals(
  items: Pick<OrderItem, "unitPrice" | "quantity">[],
  fulfillment: FulfillmentType,
  settings: Pick<BusinessSettings, "deliveryFee">,
) {
  const subtotal = items.reduce((s, it) => s + lineTotal(it), 0);
  const deliveryFee = fulfillment === "entrega" ? settings.deliveryFee : 0;
  return { subtotal, deliveryFee, total: subtotal + deliveryFee };
}

export function unitLabel(unit: string, qty?: number) {
  if (unit === "kg") return "kg";
  if (unit === "unidade") return qty === 1 ? "unidade" : "unidades";
  if (unit === "caixa") return qty === 1 ? "caixa" : "caixas";
  return unit;
}

export function priceSuffix(unit: string) {
  if (unit === "kg") return "/kg";
  if (unit === "unidade") return "/un.";
  return `/${unit}`;
}
