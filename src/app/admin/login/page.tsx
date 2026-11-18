"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AlertCircle, Info } from "lucide-react";
import { Logo } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { photo, PHOTOS } from "@/data/seed";
import { adminAuth, DEMO_ADMIN } from "@/features/auth/admin-session";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(DEMO_ADMIN.email);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await adminAuth.signIn(email, password);
      router.replace("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao entrar");
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <Logo />
          <h1 className="mt-10 text-3xl font-medium">Área da confeitaria</h1>
          <p className="mt-1.5 text-cocoa-500">Entre para gerenciar encomendas, cardápio e agenda.</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <Field label="E-mail" htmlFor="email">
              <Input id="email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
            <Field label="Senha" htmlFor="password">
              <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </Field>
            {error && (
              <p className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">
                <AlertCircle className="h-4 w-4" /> {error}
              </p>
            )}
            <Button type="submit" size="lg" className="w-full" loading={loading}>
              Entrar
            </Button>
          </form>

          <div className="mt-6 flex gap-2.5 rounded-2xl border border-gold-500/30 bg-[#fbf1df] p-4 text-sm text-[#7a5822]">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              <strong>Ambiente de demonstração.</strong> Use a senha <code className="rounded bg-white/70 px-1.5 py-0.5 font-bold">{DEMO_ADMIN.password}</code>.
            </p>
          </div>
        </div>
      </div>
      <div className="relative hidden lg:block">
        <Image src={photo(PHOTOS.macaronCake, 1400)} alt="" fill priority sizes="50vw" className="object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-cocoa-900/70 via-cocoa-900/10 to-transparent" />
        <blockquote className="absolute right-12 bottom-12 left-12 text-cream-50">
          <p className="font-display text-3xl leading-snug italic">“Organização é o ingrediente secreto de toda confeitaria feliz.”</p>
        </blockquote>
      </div>
    </main>
  );
}
