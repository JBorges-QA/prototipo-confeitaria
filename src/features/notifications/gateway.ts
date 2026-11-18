import type { NotificationLog, Order } from "@/domain/order";
import type { BusinessSettings } from "@/domain/settings";
import { buildBusinessMessage, buildCustomerMessage } from "./whatsapp";

/**
 * Gateway de notificações. Hoje: modo simulado (registra a mensagem no
 * pedido para demonstração). Em produção: WhatsApp Business Cloud API
 * (Meta) ou provedor como Z-API / Twilio, chamado a partir do servidor.
 */
export interface NotificationGateway {
  orderPlaced(order: Order, settings: BusinessSettings): Promise<NotificationLog[]>;
}

export const simulatedWhatsappGateway: NotificationGateway = {
  async orderPlaced(order, settings) {
    const at = new Date().toISOString();
    return [
      { channel: "whatsapp", to: "confeitaria", status: "simulado", at, message: buildBusinessMessage(order) },
      { channel: "whatsapp", to: "cliente", status: "simulado", at, message: buildCustomerMessage(order, settings) },
    ];
  },
};
