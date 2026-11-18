"use client";

import { storageNamespace } from "@/config/site";
import type { Collection } from "../contracts";

export const CHANGE_EVENT = "fda:data-changed";

const keyOf = (name: string) => `${storageNamespace}:${name}`;

/** Memória de fallback para SSR / navegação privada sem localStorage. */
const memory = new Map<string, string>();

function storage(): Pick<Storage, "getItem" | "setItem" | "removeItem"> {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const probe = "__fda_probe__";
      window.localStorage.setItem(probe, "1");
      window.localStorage.removeItem(probe);
      return window.localStorage;
    }
  } catch {
    /* sem acesso ao storage */
  }
  return {
    getItem: (k) => memory.get(k) ?? null,
    setItem: (k, v) => void memory.set(k, v),
    removeItem: (k) => void memory.delete(k),
  };
}

export function readJSON<T>(name: string, fallback: () => T): T {
  const raw = storage().getItem(keyOf(name));
  if (raw == null) {
    const value = fallback();
    writeJSON(name, value, { silent: true });
    return value;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback();
  }
}

export function writeJSON<T>(name: string, value: T, opts: { silent?: boolean } = {}) {
  try {
    storage().setItem(keyOf(name), JSON.stringify(value));
  } catch (err) {
    // Quota excedida (ex.: muitas fotos em base64). Em produção as fotos vão para um storage.
    throw new Error(
      "Não foi possível salvar: o armazenamento do navegador está cheio. Remova algumas fotos e tente novamente.",
      { cause: err },
    );
  }
  if (!opts.silent) notify(name as Collection);
}

export function removeKey(name: string) {
  storage().removeItem(keyOf(name));
}

export function notify(collection: Collection) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: { collection } }));
}

/** Escuta mudanças na mesma aba e em outras abas (evento `storage`). */
export function subscribe(collections: Collection[], cb: () => void) {
  const onLocal = (e: Event) => {
    const c = (e as CustomEvent<{ collection: Collection | "*" }>).detail?.collection;
    if (c === "*" || collections.includes(c as Collection)) cb();
  };
  const onStorage = (e: StorageEvent) => {
    if (!e.key) return cb();
    if (collections.some((c) => e.key === keyOf(c))) cb();
  };
  window.addEventListener(CHANGE_EVENT, onLocal);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onLocal);
    window.removeEventListener("storage", onStorage);
  };
}

/** Simula latência de rede para que estados de carregamento sejam exercitados. */
export const delay = (ms = 120) => new Promise((r) => setTimeout(r, ms));
