/**
 * Configuração estática da marca. Dados que a confeiteira edita no painel
 * (telefone, horários, taxa de entrega, texto "sobre") ficam em `Settings`
 * (src/domain/settings.ts) e são persistidos pela camada de dados.
 */
export const siteConfig = {
  name: "Flor de Açúcar",
  tagline: "Ateliê de Doces",
  description:
    "Bolos, doces finos e encomendas artesanais feitos à mão para tornar cada celebração inesquecível. Monte seu pedido online.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /** Prefixo dos códigos de pedido (ex.: FA-1042) */
  orderCodePrefix: "FA",
} as const;

export const storageNamespace = "fda:v1";
