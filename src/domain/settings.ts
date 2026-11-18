import type { Cents } from "./catalog";

export interface BusinessSettings {
  businessName: string;
  ownerName: string;
  /** Somente dígitos, com DDI: 5511999999999 */
  whatsapp: string;
  instagram: string;
  email: string;
  pickupAddress: string;
  serviceArea: string;
  openingHours: string;

  /** Antecedência mínima (em dias) para encomendas */
  minLeadDays: number;
  /** Dias da semana sem entregas (0 = domingo … 6 = sábado) */
  closedWeekdays: number[];
  timeSlots: string[];
  deliveryEnabled: boolean;
  pickupEnabled: boolean;
  deliveryFee: Cents;
  /** Valor mínimo do pedido */
  minOrderValue: Cents;

  about: {
    title: string;
    text: string;
    image: string;
  };
}

export interface Testimonial {
  id: string;
  name: string;
  occasion: string;
  text: string;
  rating: number;
}

export interface InstagramPost {
  id: string;
  imageUrl: string;
  caption: string;
  permalink: string;
  likes: number;
}
