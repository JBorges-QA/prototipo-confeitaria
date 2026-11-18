"use client";

import { useEffect, useState } from "react";
import { getDataSource } from "@/data";
import type { Product } from "@/domain/catalog";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState, Skeleton } from "@/components/ui/misc";
import { ProductForm } from "./product-form";

/** Carrega o produto uma única vez (sem revalidar enquanto o formulário está aberto). */
export function EditProductView({ id }: { id: string }) {
  const [state, setState] = useState<{ loading: boolean; product: Product | null }>({ loading: true, product: null });

  useEffect(() => {
    getDataSource()
      .catalog.getProduct(id)
      .then((product) => setState({ loading: false, product }));
  }, [id]);

  if (state.loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-4">
        <Skeleton className="h-10 w-60" />
        <Skeleton className="h-80" />
      </div>
    );
  }
  if (!state.product) {
    return <EmptyState title="Produto não encontrado" action={<ButtonLink href="/admin/produtos">Voltar</ButtonLink>} />;
  }
  return <ProductForm product={state.product} />;
}
