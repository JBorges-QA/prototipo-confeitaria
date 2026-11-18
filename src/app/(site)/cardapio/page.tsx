import type { Metadata } from "next";
import { MenuView } from "@/components/site/menu-view";

export const metadata: Metadata = {
  title: "Cardápio",
  description: "Bolos, doces de festa, cupcakes, tortas e caixas para presente. Monte seu pedido online.",
};

export default function CardapioPage() {
  return <MenuView />;
}
