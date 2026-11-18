"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { PackageSearch } from "lucide-react";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { OrderTrackingView } from "./order-tracking-view";

/** /acompanhar → formulário · /acompanhar?codigo=FA-1041 → acompanhamento do pedido */
export function TrackOrderPage() {
  const params = useSearchParams();
  const code = params.get("codigo");
  if (code) return <OrderTrackingView code={code} isNew={params.get("novo") === "1"} />;
  return <TrackOrderForm />;
}

function TrackOrderForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  return (
    <div className="container-page max-w-md py-16 text-center sm:py-24">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-blush-100 text-rose-500">
        <PackageSearch className="h-7 w-7" />
      </span>
      <h1 className="mt-5 text-3xl font-medium sm:text-4xl">Acompanhe seu pedido</h1>
      <p className="mt-2 text-cocoa-500">Digite o código que você recebeu no WhatsApp ao finalizar a encomenda.</p>
      <form
        className="mt-8 flex flex-col gap-3 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          const c = code.trim().toUpperCase();
          if (!c) return;
          router.push(routes.orderTracking(c.startsWith(siteConfig.orderCodePrefix) ? c : `${siteConfig.orderCodePrefix}-${c}`));
        }}
      >
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={`Ex.: ${siteConfig.orderCodePrefix}-1035`}
          className="text-center uppercase sm:text-left"
          aria-label="Código do pedido"
        />
        <Button type="submit">Buscar</Button>
      </form>
    </div>
  );
}
