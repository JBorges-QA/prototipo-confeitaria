import { z } from "zod";

/** Valores monetários são sempre armazenados em centavos (inteiros). */
export type Cents = number;

export const categorySchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Informe o nome da categoria"),
  description: z.string().optional(),
  sortOrder: z.number().int(),
});
export type Category = z.infer<typeof categorySchema>;

export const productSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string().min(2, "Informe o nome do produto"),
  description: z.string().max(400, "Máximo de 400 caracteres"),
  categoryId: z.string().min(1, "Escolha uma categoria"),
  price: z.number().int().positive("Informe um preço válido"),
  /** Unidade de venda: "kg", "unidade", "cento", "caixa c/ 12"... */
  unit: z.string().min(1),
  minQuantity: z.number().positive(),
  quantityStep: z.number().positive(),
  /** Sabores / recheios disponíveis para escolha do cliente */
  flavors: z.array(z.string()),
  images: z.array(z.string()),
  tags: z.array(z.string()),
  featured: z.boolean(),
  active: z.boolean(),
  sortOrder: z.number().int(),
  updatedAt: z.string(),
});
export type Product = z.infer<typeof productSchema>;

export type ProductInput = Omit<Product, "id" | "slug" | "updatedAt"> & { id?: string };
