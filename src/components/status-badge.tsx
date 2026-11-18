import { ORDER_STATUS_META, type OrderStatus } from "@/domain/order";
import { Badge } from "@/components/ui/misc";

export function StatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  const meta = ORDER_STATUS_META[status];
  return (
    <Badge tone={meta.tone} className={className}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {meta.label}
    </Badge>
  );
}
