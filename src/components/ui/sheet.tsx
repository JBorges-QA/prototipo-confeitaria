"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Painel deslizante: bottom-sheet no celular e gaveta lateral no desktop.
 * `variant="dialog"` centraliza no desktop (usado para detalhes de produto).
 */
export function Sheet({
  open,
  onClose,
  title,
  children,
  footer,
  variant = "drawer",
  className,
}: {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  variant?: "drawer" | "dialog";
  className?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <button
        aria-label="Fechar"
        className="absolute inset-0 bg-cocoa-900/40 backdrop-blur-[2px] animate-[fade-up_0.2s_ease-out_both]"
        onClick={onClose}
      />
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 flex max-h-[92dvh] flex-col rounded-t-3xl bg-cream-50 shadow-lift animate-slide-up",
          variant === "drawer" &&
            "sm:inset-y-0 sm:right-0 sm:left-auto sm:max-h-none sm:w-[420px] sm:rounded-none sm:rounded-l-3xl sm:animate-[fade-up_0.25s_ease-out_both]",
          variant === "dialog" &&
            "sm:inset-auto sm:top-1/2 sm:left-1/2 sm:max-h-[88dvh] sm:w-[560px] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl sm:animate-[fade-up_0.25s_ease-out_both]",
          className,
        )}
      >
        <div className="mx-auto mt-2.5 h-1.5 w-10 rounded-full bg-cocoa-900/15 sm:hidden" />
        {(title || variant === "drawer") && (
          <div className="flex items-center justify-between gap-3 px-5 pt-3 pb-2 sm:pt-5">
            <div className="text-xl font-medium text-cocoa-900" style={{ fontFamily: "var(--font-display)" }}>
              {title}
            </div>
            <button
              onClick={onClose}
              className="grid h-9 w-9 place-items-center rounded-full text-cocoa-500 hover:bg-cocoa-900/5"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>
        {footer && <div className="border-t border-cocoa-900/10 bg-white px-5 pt-4 pb-safe">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
