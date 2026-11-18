import { z } from "zod";
import type { Cents } from "./catalog";

export const ORDER_STATUSES = [
  "recebida",
  "confirmada",
  "em_producao",
  "pronta",
  "entregue",
  "cancelada",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

/** Fluxo principal (cancelada fica fora da linha do tempo). */
export const ORDER_FLOW: OrderStatus[] = ["recebida", "confirmada", "em_producao", "pronta", "entregue"];

export const ORDER_STATUS_META: Record<
  OrderStatus,
  { label: string; description: string; tone: "rose" | "gold" | "blue" | "violet" | "sage" | "muted" }
> = {
  recebida: { label: "Recebida", description: "Pedido recebido, aguardando confirmação", tone: "rose" },
  confirmada: { label: "Confirmada", description: "Pedido confirmado pela confeitaria", tone: "gold" },
  em_producao: { label: "Em produção", description: "Seus doces estão sendo preparados", tone: "violet" },
  pronta: { label: "Pronta", description: "Pronta para retirada ou saindo para entrega", tone: "blue" },
  entregue: { label: "Entregue", description: "Pedido entregue. Bom proveito!", tone: "sage" },
  cancelada: { label: "Cancelada", description: "Pedido cancelado", tone: "muted" },
};

export type FulfillmentType = "entrega" | "retirada";

export interface OrderItem {
  productId: string;
  name: string;
  unit: string;
  unitPrice: Cents;
  quantity: number;
  flavor?: string;
  image?: string;
}

export interface OrderStatusChange {
  status: OrderStatus;
  at: string;
  note?: string;
}

export interface NotificationLog {
  channel: "whatsapp";
  to: "confeitaria" | "cliente";
  status: "simulado" | "enviado" | "falhou";
  at: string;
  message: string;
}

export interface Order {
  id: string;
  code: string;
  createdAt: string;
  status: OrderStatus;
  customer: { name: string; phone: string; email?: string };
  fulfillment: {
    type: FulfillmentType;
    /** YYYY-MM-DD */
    date: string;
    timeSlot: string;
    address?: string;
  };
  items: OrderItem[];
  subtotal: Cents;
  deliveryFee: Cents;
  total: Cents;
  notes?: string;
  history: OrderStatusChange[];
  notifications: NotificationLog[];
  channel: "site" | "whatsapp" | "instagram" | "balcao";
}

/** Schema do formulário de checkout — reutilizável no futuro endpoint da API. */
export const checkoutSchema = z
  .object({
    name: z.string().trim().min(3, "Informe seu nome completo"),
    phone: z
      .string()
      .transform((v) => v.replace(/\D/g, ""))
      .refine((v) => v.length >= 10 && v.length <= 11, "Informe um WhatsApp válido com DDD"),
    email: z.union([z.literal(""), z.string().email("E-mail inválido")]).optional(),
    fulfillmentType: z.enum(["entrega", "retirada"]),
    date: z.string().min(1, "Escolha a data"),
    timeSlot: z.string().min(1, "Escolha o horário"),
    address: z.string().optional(),
    notes: z.string().max(500).optional(),
  })
  .refine((d) => d.fulfillmentType === "retirada" || (d.address && d.address.trim().length >= 8), {
    message: "Informe o endereço completo para entrega",
    path: ["address"],
  });
export type CheckoutInput = z.input<typeof checkoutSchema>;

export interface CreateOrderInput {
  customer: Order["customer"];
  fulfillment: Order["fulfillment"];
  items: OrderItem[];
  notes?: string;
  channel?: Order["channel"];
}
