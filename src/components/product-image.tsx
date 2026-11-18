"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { FlowerMark } from "./brand";

/**
 * Imagem de produto com fallback elegante (sem foto / erro de carregamento).
 * Aceita URLs remotas (next/image otimizado) e data URLs vindas do upload no painel.
 */
export function ProductImage({
  src,
  alt,
  sizes = "(max-width: 640px) 50vw, 300px",
  className,
  priority,
}: {
  src?: string;
  alt: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={cn(
          "relative grid h-full w-full place-items-center overflow-hidden bg-linear-to-br from-blush-100 via-cream-200 to-blush-200",
          className,
        )}
        aria-label={alt}
        role="img"
      >
        <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_1px_1px,rgb(194_109_114/0.35)_1px,transparent_0)] [background-size:14px_14px]" />
        <FlowerMark className="relative h-1/3 max-h-16 w-auto text-rose-400/70" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={src.startsWith("data:")}
      onError={() => setFailed(true)}
      className={cn("object-cover", className)}
    />
  );
}
