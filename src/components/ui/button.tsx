import Link from "next/link";
import { forwardRef, type ButtonHTMLAttributes, type ComponentProps } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-rose-500 text-white shadow-[0_6px_16px_-6px_rgb(194_109_114/0.7)] hover:bg-rose-600 active:bg-rose-700",
  secondary: "bg-cocoa-900 text-cream-50 hover:bg-cocoa-700",
  outline: "border border-cocoa-900/15 bg-white/70 text-cocoa-900 hover:border-rose-400 hover:text-rose-600",
  ghost: "text-cocoa-700 hover:bg-cocoa-900/5",
  soft: "bg-blush-100 text-rose-700 hover:bg-blush-200",
  danger: "bg-red-600 text-white hover:bg-red-700",
  whatsapp: "bg-[#25D366] text-white hover:bg-[#1ebe5b]",
} as const;

const sizes = {
  sm: "h-9 px-3.5 text-sm gap-1.5",
  md: "h-11 px-5 text-[0.95rem] gap-2",
  lg: "h-13 px-7 text-base gap-2.5",
  icon: "h-10 w-10",
} as const;

export type ButtonVariant = keyof typeof variants;
export type ButtonSize = keyof typeof sizes;

export const buttonClasses = (variant: ButtonVariant = "primary", size: ButtonSize = "md", className?: string) =>
  cn(
    "inline-flex shrink-0 items-center justify-center rounded-full font-semibold transition-all duration-200",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500",
    "disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
    variants[variant],
    sizes[size],
    className,
  );

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, className, loading, children, disabled, type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={buttonClasses(variant, size, className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
});

export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return <Link className={buttonClasses(variant, size, className)} {...props} />;
}
