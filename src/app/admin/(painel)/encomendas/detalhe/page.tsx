"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { OrderDetailView } from "@/components/admin/order-detail-view";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/misc";

export default function OrderDetailPage() {
  return (
    <Suspense>
      <OrderDetailFromQuery />
    </Suspense>
  );
}

function OrderDetailFromQuery() {
  const id = useSearchParams().get("id");
  if (!id) return <EmptyState title="Encomenda não informada" action={<ButtonLink href="/admin/encomendas">Ver encomendas</ButtonLink>} />;
  return <OrderDetailView key={id} id={id} />;
}
