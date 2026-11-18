"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { OrdersListView } from "@/components/admin/orders-list-view";

export default function OrdersPage() {
  return (
    <Suspense>
      <OrdersFromQuery />
    </Suspense>
  );
}

function OrdersFromQuery() {
  const status = useSearchParams().get("status") ?? "ativos";
  return <OrdersListView key={status} initialStatus={status} />;
}
