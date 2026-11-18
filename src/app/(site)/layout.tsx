import { CartProvider } from "@/features/cart/cart-context";
import { CartSheet, FloatingCartBar } from "@/components/site/cart-sheet";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { ToastProvider } from "@/components/ui/toast";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <ToastProvider>
      <CartProvider>
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <CartSheet />
        <FloatingCartBar />
      </CartProvider>
    </ToastProvider>
  );
}
