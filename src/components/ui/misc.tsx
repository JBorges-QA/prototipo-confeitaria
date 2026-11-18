import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("rounded-2xl border border-cocoa-900/[0.07] bg-white shadow-soft", className)}>{children}</div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-cocoa-900/[0.06]", className)} />;
}

const tones = {
  rose: "bg-blush-100 text-rose-700 ring-rose-500/20",
  gold: "bg-[#fbf1df] text-[#8a6326] ring-gold-500/30",
  violet: "bg-[#f1ecfa] text-[#6a4fa3] ring-[#6a4fa3]/20",
  blue: "bg-[#e8f1fb] text-[#2e6aa8] ring-[#2e6aa8]/20",
  sage: "bg-sage-100 text-[#4b6b46] ring-sage-500/25",
  muted: "bg-cocoa-900/5 text-cocoa-500 ring-cocoa-900/10",
} as const;
export type Tone = keyof typeof tones;

export function Badge({ tone = "rose", className, children }: { tone?: Tone; className?: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center px-6 py-12 text-center", className)}>
      {icon && <div className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-blush-100 text-rose-500">{icon}</div>}
      <h3 className="text-lg font-semibold text-cocoa-900">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-cocoa-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow && (
        <p className="mb-2 text-xs font-bold tracking-[0.22em] text-rose-500 uppercase">{eyebrow}</p>
      )}
      <h2 className="text-3xl leading-tight font-medium text-cocoa-900 sm:text-4xl">{title}</h2>
      {description && <p className="mt-3 text-[0.98rem] leading-relaxed text-cocoa-500">{description}</p>}
    </div>
  );
}
