"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { EditProductView } from "@/components/admin/edit-product-view";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/misc";

export default function EditProductPage() {
  return (
    <Suspense>
      <EditProductFromQuery />
    </Suspense>
  );
}

function EditProductFromQuery() {
  const id = useSearchParams().get("id");
  if (!id) return <EmptyState title="Produto não informado" action={<ButtonLink href="/admin/produtos">Ver cardápio</ButtonLink>} />;
  return <EditProductView key={id} id={id} />;
}
