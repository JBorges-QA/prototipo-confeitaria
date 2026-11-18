import { OrderDetailView } from "@/components/admin/order-detail-view";

export const metadata = { title: "Detalhes da encomenda" };

export default async function OrderDetailPage(props: PageProps<"/admin/encomendas/[id]">) {
  const { id } = await props.params;
  return <OrderDetailView id={id} />;
}
