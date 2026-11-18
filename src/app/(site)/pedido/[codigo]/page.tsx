import type { Metadata } from "next";
import { OrderTrackingView } from "@/components/site/order-tracking-view";

export const metadata: Metadata = { title: "Seu pedido", robots: { index: false } };

export default async function OrderPage(props: PageProps<"/pedido/[codigo]">) {
  const { codigo } = await props.params;
  const sp = await props.searchParams;
  return <OrderTrackingView code={decodeURIComponent(codigo)} isNew={sp.novo === "1"} />;
}
