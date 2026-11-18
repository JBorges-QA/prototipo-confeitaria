import type { Metadata } from "next";
import { CheckoutView } from "@/components/site/checkout-view";

export const metadata: Metadata = { title: "Finalizar pedido" };

export default function CheckoutPage() {
  return <CheckoutView />;
}
