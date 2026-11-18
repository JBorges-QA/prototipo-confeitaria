"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Collection, DataSource } from "./contracts";
import { getDataSource } from "./index";
import { subscribe } from "./local/store";

interface QueryState<T> {
  data: T | undefined;
  loading: boolean;
  error: Error | null;
  reload: () => void;
}

/**
 * Hook de leitura simples com revalidação automática quando as coleções
 * observadas mudam (inclusive em outra aba — ótimo para demonstrar o
 * pedido chegando no painel em tempo real).
 *
 * Ao migrar para uma API, pode ser trocado por TanStack Query/SWR mantendo
 * a mesma assinatura.
 */
export function useQuery<T>(
  fetcher: (ds: DataSource) => Promise<T>,
  deps: unknown[],
  collections: Collection[],
): QueryState<T> {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  });
  const [tick, setTick] = useState(0);
  const reload = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let alive = true;
    fetcherRef
      .current(getDataSource())
      .then((d) => {
        if (!alive) return;
        setData(d);
        setError(null);
      })
      .catch((e: unknown) => alive && setError(e instanceof Error ? e : new Error(String(e))))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, ...deps]);

  const key = collections.join("|");
  useEffect(() => subscribe(key.split("|") as Collection[], reload), [key, reload]);

  return { data, loading, error, reload };
}

/* Atalhos usados pelas telas */
export const useCategories = () => useQuery((ds) => ds.catalog.listCategories(), [], ["categories"]);

export const useProducts = (includeInactive = false) =>
  useQuery((ds) => ds.catalog.listProducts({ includeInactive }), [includeInactive], ["products"]);

export const useSettings = () => useQuery((ds) => ds.settings.get(), [], ["settings"]);
