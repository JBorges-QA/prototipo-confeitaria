import { OrdersListView } from "@/components/admin/orders-list-view";

export const metadata = { title: "Encomendas" };

export default async function OrdersPage(props: PageProps<"/admin/encomendas">) {
  const sp = await props.searchParams;
  return <OrdersListView initialStatus={typeof sp.status === "string" ? sp.status : "ativos"} />;
}
