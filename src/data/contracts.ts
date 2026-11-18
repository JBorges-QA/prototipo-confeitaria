/**
 * Contratos da camada de dados.
 *
 * Toda a aplicação (site e painel) conversa APENAS com estas interfaces.
 * Hoje existe a implementação `local` (localStorage, ideal para demonstração).
 * Para produção, cria-se uma implementação `api` (ex.: Supabase/Postgres ou
 * rotas /api com Prisma) que satisfaça os mesmos contratos — nenhuma tela
 * precisa ser alterada.
 */
import type { Category, Product, ProductInput } from "@/domain/catalog";
import type { CreateOrderInput, Order, OrderStatus } from "@/domain/order";
import type { BusinessSettings, InstagramPost, Testimonial } from "@/domain/settings";

export interface CatalogRepository {
  listCategories(): Promise<Category[]>;
  saveCategory(category: Omit<Category, "id"> & { id?: string }): Promise<Category>;
  deleteCategory(id: string): Promise<void>;

  listProducts(opts?: { includeInactive?: boolean }): Promise<Product[]>;
  getProduct(id: string): Promise<Product | null>;
  saveProduct(input: ProductInput): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
}

export interface OrderFilter {
  status?: OrderStatus | "ativos";
  from?: string;
  to?: string;
  search?: string;
}

export interface OrderRepository {
  list(filter?: OrderFilter): Promise<Order[]>;
  get(id: string): Promise<Order | null>;
  getByCode(code: string): Promise<Order | null>;
  create(input: CreateOrderInput, totals: { subtotal: number; deliveryFee: number; total: number }): Promise<Order>;
  updateStatus(id: string, status: OrderStatus, note?: string): Promise<Order>;
  appendNotifications(id: string, logs: Order["notifications"]): Promise<void>;
}

export interface SettingsRepository {
  get(): Promise<BusinessSettings>;
  save(settings: BusinessSettings): Promise<BusinessSettings>;
}

export interface ContentRepository {
  listTestimonials(): Promise<Testimonial[]>;
}

/** Fonte das últimas fotos do Instagram (mock hoje; Instagram Graph API depois). */
export interface InstagramFeedProvider {
  latestPosts(limit: number): Promise<InstagramPost[]>;
}

export interface DataSource {
  catalog: CatalogRepository;
  orders: OrderRepository;
  settings: SettingsRepository;
  content: ContentRepository;
  instagram: InstagramFeedProvider;
  /** Somente para demonstração: restaura os dados iniciais. */
  resetDemo?(): Promise<void>;
}

/** Coleções observáveis — usadas pelos hooks para revalidar telas. */
export type Collection = "products" | "categories" | "orders" | "settings" | "content";
