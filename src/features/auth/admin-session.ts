"use client";

import { useEffect, useState } from "react";
import { storageNamespace } from "@/config/site";

/**
 * Autenticação de DEMONSTRAÇÃO (somente no navegador).
 *
 * Em produção substituir por autenticação real no servidor
 * (Supabase Auth / Auth.js) com cookie httpOnly e verificação no `proxy.ts`
 * e nas rotas da API. A interface `AdminAuth` permanece a mesma.
 */
export interface AdminAuth {
  signIn(email: string, password: string): Promise<void>;
  signOut(): void;
  current(): { email: string; name: string } | null;
}

export const DEMO_ADMIN = {
  email: process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL ?? "admin@flordeacucar.com.br",
  password: process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD ?? "doce2026",
  name: "Marina",
};

const KEY = `${storageNamespace}:admin-session`;

export const adminAuth: AdminAuth = {
  async signIn(email, password) {
    await new Promise((r) => setTimeout(r, 400));
    if (email.trim().toLowerCase() !== DEMO_ADMIN.email || password !== DEMO_ADMIN.password) {
      throw new Error("E-mail ou senha incorretos.");
    }
    localStorage.setItem(KEY, JSON.stringify({ email: DEMO_ADMIN.email, name: DEMO_ADMIN.name }));
  },
  signOut() {
    localStorage.removeItem(KEY);
  },
  current() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
};

export function useAdminSession() {
  const [state, setState] = useState<{ ready: boolean; user: ReturnType<AdminAuth["current"]> }>({ ready: false, user: null });
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- leitura do storage só existe no cliente
    setState({ ready: true, user: adminAuth.current() });
  }, []);
  return state;
}
