import type { Order } from "@/domain/order";
import type { BusinessSettings } from "@/domain/settings";
import { formatDateLong } from "@/lib/dates";
import { formatCurrency, formatPhone, formatQuantity } from "@/lib/utils";

/** Monta link wa.me — funciona hoje, sem API paga. */
export function whatsappLink(phoneDigits: string, text?: string) {
  const phone = phoneDigits.replace(/\D/g, "");
  const full = phone.length <= 11 ? `55${phone}` : phone;
  return `https://wa.me/${full}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

const itemLines = (order: Order) =>
  order.items
    .map(
      (it) =>
        `• ${formatQuantity(it.quantity)} ${it.unit === "kg" ? "kg" : "x"} ${it.name}${it.flavor ? ` (${it.flavor})` : ""} — ${formatCurrency(Math.round(it.unitPrice * it.quantity))}`,
    )
    .join("\n");

/** Mensagem enviada automaticamente para o WhatsApp da confeitaria. */
export function buildBusinessMessage(order: Order) {
  const f = order.fulfillment;
  return [
    `🌸 *Novo pedido ${order.code}*`,
    ``,
    `*Cliente:* ${order.customer.name}`,
    `*WhatsApp:* ${formatPhone(order.customer.phone)}`,
    ``,
    itemLines(order),
    ``,
    `*${f.type === "entrega" ? "Entrega" : "Retirada"}:* ${formatDateLong(f.date)} · ${f.timeSlot}`,
    f.address ? `*Endereço:* ${f.address}` : null,
    order.notes ? `*Obs.:* ${order.notes}` : null,
    ``,
    order.deliveryFee ? `Taxa de entrega: ${formatCurrency(order.deliveryFee)}` : null,
    `*Total: ${formatCurrency(order.total)}*`,
  ]
    .filter((l) => l !== null)
    .join("\n");
}

/** Confirmação enviada ao cliente. */
export function buildCustomerMessage(order: Order, settings: BusinessSettings) {
  const first = order.customer.name.split(" ")[0];
  const f = order.fulfillment;
  return [
    `Olá, ${first}! 💕`,
    `Recebemos seu pedido *${order.code}* na ${settings.businessName}.`,
    ``,
    itemLines(order),
    ``,
    `📅 ${f.type === "entrega" ? "Entrega" : "Retirada"}: ${formatDateLong(f.date)}, ${f.timeSlot}`,
    `💰 Total: ${formatCurrency(order.total)}`,
    ``,
    `Em breve confirmaremos os detalhes e a forma de pagamento. Obrigada pela preferência! 🌸`,
  ].join("\n");
}

export function buildStatusMessage(order: Order, statusLabel: string) {
  const first = order.customer.name.split(" ")[0];
  return `Olá, ${first}! Seu pedido *${order.code}* foi atualizado para: *${statusLabel}*. 🌸`;
}
