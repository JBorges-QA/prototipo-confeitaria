"use client";

import { Minus, Plus } from "lucide-react";
import { cn, formatQuantity } from "@/lib/utils";

export function QuantityStepper({
  value,
  min,
  step,
  onChange,
  suffix,
  size = "md",
  allowRemove = false,
}: {
  value: number;
  min: number;
  step: number;
  onChange: (v: number) => void;
  suffix?: string;
  size?: "sm" | "md";
  /** Quando true, diminuir abaixo do mínimo remove o item (valor 0). */
  allowRemove?: boolean;
}) {
  const dec = () => {
    const next = Math.round((value - step) * 100) / 100;
    if (next < min) return allowRemove ? onChange(0) : undefined;
    onChange(next);
  };
  const inc = () => onChange(Math.round((value + step) * 100) / 100);
  const btn = cn(
    "grid place-items-center rounded-full text-cocoa-700 transition hover:bg-blush-100 hover:text-rose-600 disabled:opacity-30",
    size === "sm" ? "h-8 w-8" : "h-10 w-10",
  );
  return (
    <div className="inline-flex items-center rounded-full border border-cocoa-900/12 bg-white p-0.5">
      <button type="button" className={btn} onClick={dec} disabled={!allowRemove && value <= min} aria-label="Diminuir">
        <Minus className="h-4 w-4" />
      </button>
      <span className={cn("min-w-14 text-center font-bold tabular-nums", size === "sm" ? "text-sm" : "text-base")}>
        {formatQuantity(value)}
        {suffix && <span className="ml-0.5 text-xs font-semibold text-cocoa-400">{suffix}</span>}
      </span>
      <button type="button" className={btn} onClick={inc} aria-label="Aumentar">
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
