"use client";

import { getDataSource } from "@/data";
import type { CreateOrderInput, Order } from "@/domain/order";
import { simulatedWhatsappGateway, type NotificationGateway } from "@/features/notifications/gateway";
import { computeTotals } from "./pricing";

/**
 * Caso de uso "finalizar pedido". Concentra a orquestração para que,
 * ao migrar para o servidor (Server Action / rota /api), baste mover
 * este arquivo — as telas continuam chamando `placeOrder`.
 */
export async function placeOrder(
  input: CreateOrderInput,
  gateway: NotificationGateway = simulatedWhatsappGateway,
): Promise<Order> {
  const ds = getDataSource();
  const settings = await ds.settings.get();

  if (input.items.length === 0) throw new Error("Seu pedido está vazio.");
  if (input.fulfillment.type === "entrega" && !settings.deliveryEnabled)
    throw new Error("No momento não estamos realizando entregas.");

  const totals = computeTotals(input.items, input.fulfillment.type, settings);
  if (totals.subtotal < settings.minOrderValue)
    throw new Error("O pedido não atingiu o valor mínimo.");

  const order = await ds.orders.create(input, totals);
  const logs = await gateway.orderPlaced(order, settings);
  await ds.orders.appendNotifications(order.id, logs);
  return { ...order, notifications: logs };
}
