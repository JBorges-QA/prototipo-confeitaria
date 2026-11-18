"use client";

import type { DataSource } from "./contracts";
import { createLocalDataSource } from "./local/local-data-source";

/**
 * Ponto único de escolha da fonte de dados.
 *
 * NEXT_PUBLIC_DATA_SOURCE=local  → localStorage (demonstração, padrão)
 * NEXT_PUBLIC_DATA_SOURCE=api    → implementar `createApiDataSource()` (Supabase / rotas /api)
 */
let instance: DataSource | null = null;

export function getDataSource(): DataSource {
  if (instance) return instance;
  const kind = process.env.NEXT_PUBLIC_DATA_SOURCE ?? "local";
  switch (kind) {
    case "local":
    default:
      instance = createLocalDataSource();
  }
  return instance;
}

export type { DataSource } from "./contracts";
