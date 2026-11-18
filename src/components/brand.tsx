import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Logotipo provisório (wordmark + símbolo).
 * O cliente já possui logo: basta salvar em /public/brand/logo.svg e trocar
 * este componente por um <Image /> — todas as telas usam <Logo />.
 */
export function FlowerMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden>
      {[0, 72, 144, 216, 288].map((r) => (
        <ellipse key={r} cx="20" cy="11" rx="6" ry="9" fill="currentColor" opacity="0.85" transform={`rotate(${r} 20 20)`} />
      ))}
      <circle cx="20" cy="20" r="4.2" fill="#c49a5a" />
    </svg>
  );
}

export function Logo({ className, light = false, href = "/" }: { className?: string; light?: boolean; href?: string }) {
  return (
    <Link href={href} className={cn("group inline-flex items-center gap-2.5", className)} aria-label="Flor de Açúcar — início">
      <FlowerMark className={cn("h-8 w-8 transition-transform duration-500 group-hover:rotate-[72deg]", light ? "text-blush-200" : "text-rose-400")} />
      <span className="flex flex-col leading-none">
        <span
          className={cn("text-[1.35rem] font-medium italic tracking-tight", light ? "text-cream-50" : "text-cocoa-900")}
          style={{ fontFamily: "var(--font-display)" }}
        >
          Flor de Açúcar
        </span>
        <span className={cn("mt-0.5 text-[0.6rem] font-bold tracking-[0.3em] uppercase", light ? "text-gold-300" : "text-gold-500")}>
          Ateliê de doces
        </span>
      </span>
    </Link>
  );
}
