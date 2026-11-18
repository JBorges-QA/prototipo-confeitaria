import type { Metadata } from "next";
import { Suspense } from "react";
import { TrackOrderPage } from "@/components/site/track-order-page";

export const metadata: Metadata = { title: "Acompanhar pedido", robots: { index: false } };

export default function AcompanharPage() {
  return (
    <Suspense>
      <TrackOrderPage />
    </Suspense>
  );
}
