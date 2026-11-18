/**
 * Construtores de URL centralizados. As telas nunca montam caminhos à mão,
 * então trocar o formato das rotas (ex.: voltar a /pedido/[codigo] quando
 * houver servidor) é uma mudança em um único arquivo.
 *
 * Hoje os identificadores vão em query string para o site poder ser
 * exportado como estático (GitHub Pages) sem precisar de servidor.
 */
export const routes = {
  orderTracking: (code: string, opts?: { isNew?: boolean }) =>
    `/acompanhar?codigo=${encodeURIComponent(code)}${opts?.isNew ? "&novo=1" : ""}`,
  adminOrders: (status?: string) => (status ? `/admin/encomendas?status=${status}` : "/admin/encomendas"),
  adminOrder: (id: string) => `/admin/encomendas/detalhe?id=${encodeURIComponent(id)}`,
  adminProducts: () => "/admin/produtos",
  adminProduct: (id: string) => `/admin/produtos/editar?id=${encodeURIComponent(id)}`,
} as const;
