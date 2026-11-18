import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
export const formatCurrency = (cents: number) => brl.format(cents / 100);

/** "12,50" | "12.5" | "R$ 12,50" → 1250 */
export function parseCurrencyToCents(value: string): number {
  const clean = value.replace(/[^\d,.-]/g, "").replace(/\.(?=\d{3}(\D|$))/g, "").replace(",", ".");
  const n = Number.parseFloat(clean);
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
}

export const centsToInput = (cents: number) => (cents / 100).toFixed(2).replace(".", ",");

export function formatQuantity(qty: number) {
  return Number.isInteger(qty) ? String(qty) : qty.toLocaleString("pt-BR", { maximumFractionDigits: 2 });
}

export function formatPhone(digits: string) {
  const d = digits.replace(/\D/g, "").replace(/^55(?=\d{10,11}$)/, "");
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7, 11)}`;
}

export function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function createId(prefix = "") {
  const rnd =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}${Date.now().toString(36)}${rnd}`;
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}
