import { Check } from "lucide-react";
import { ORDER_FLOW, ORDER_STATUS_META, type Order } from "@/domain/order";
import { formatDateTime } from "@/lib/dates";
import { cn } from "@/lib/utils";

/** Linha do tempo de status — usada no acompanhamento (cliente) e no painel. */
export function OrderTimeline({ order, orientation = "vertical" }: { order: Order; orientation?: "vertical" | "horizontal" }) {
  const currentIdx = ORDER_FLOW.indexOf(order.status);
  const atOf = (s: string) => [...order.history].reverse().find((h) => h.status === s)?.at;

  if (order.status === "cancelada") {
    return <p className="rounded-xl bg-cocoa-900/5 p-4 text-sm font-semibold text-cocoa-500">Este pedido foi cancelado.</p>;
  }

  if (orientation === "horizontal") {
    return (
      <ol className="flex items-start">
        {ORDER_FLOW.map((s, i) => {
          const done = i <= currentIdx;
          return (
            <li key={s} className="relative flex flex-1 flex-col items-center text-center">
              {i > 0 && (
                <span className={cn("absolute top-3.5 right-1/2 h-0.5 w-full", i <= currentIdx ? "bg-rose-500" : "bg-cocoa-900/10")} />
              )}
              <span
                className={cn(
                  "relative z-10 grid h-7 w-7 place-items-center rounded-full text-xs font-bold ring-4 ring-white",
                  done ? "bg-rose-500 text-white" : "bg-cocoa-900/10 text-cocoa-400",
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span className={cn("mt-1.5 text-[0.68rem] font-semibold sm:text-xs", done ? "text-cocoa-900" : "text-cocoa-400")}>
                {ORDER_STATUS_META[s].label}
              </span>
            </li>
          );
        })}
      </ol>
    );
  }

  return (
    <ol className="space-y-0">
      {ORDER_FLOW.map((s, i) => {
        const done = i <= currentIdx;
        const current = i === currentIdx;
        const at = atOf(s);
        return (
          <li key={s} className="relative flex gap-3.5 pb-5 last:pb-0">
            {i < ORDER_FLOW.length - 1 && (
              <span className={cn("absolute top-7 left-[13px] h-[calc(100%-1.75rem)] w-0.5", i < currentIdx ? "bg-rose-500" : "bg-cocoa-900/10")} />
            )}
            <span
              className={cn(
                "relative grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold",
                done ? "bg-rose-500 text-white" : "bg-cocoa-900/[0.07] text-cocoa-400",
                current && "ring-4 ring-rose-500/20",
              )}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </span>
            <div className="pt-0.5">
              <p className={cn("text-sm font-bold", done ? "text-cocoa-900" : "text-cocoa-400")}>{ORDER_STATUS_META[s].label}</p>
              <p className="text-xs text-cocoa-400">{done && at ? formatDateTime(at) : ORDER_STATUS_META[s].description}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
