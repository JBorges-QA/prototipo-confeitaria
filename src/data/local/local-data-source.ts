"use client";

import { siteConfig } from "@/config/site";
import type { Category, Product } from "@/domain/catalog";
import type { Order } from "@/domain/order";
import type { BusinessSettings, Testimonial } from "@/domain/settings";
import { createId, slugify } from "@/lib/utils";
import type { DataSource } from "../contracts";
import {
  buildSeedOrders,
  seedCategories,
  seedInstagram,
  seedProducts,
  seedSettings,
  seedTestimonials,
} from "../seed";
import { delay, notify, readJSON, removeKey, writeJSON } from "./store";

const K = {
  products: "products",
  categories: "categories",
  orders: "orders",
  orderCounter: "orders-counter",
  settings: "settings",
  testimonials: "content",
} as const;

function readOrders() {
  return readJSON<Order[]>(K.orders, () => {
    const { orders, nextNumber } = buildSeedOrders();
    writeJSON(K.orderCounter, nextNumber, { silent: true });
    return orders;
  });
}

function nextOrderCode() {
  readOrders(); // garante seed antes do contador
  const n = readJSON<number>(K.orderCounter, () => 1001);
  writeJSON(K.orderCounter, n + 1, { silent: true });
  return `${siteConfig.orderCodePrefix}-${n}`;
}

const sortProducts = (a: Product, b: Product) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name);

/**
 * Implementação de demonstração: persiste tudo no navegador.
 * Ideal para apresentar ao cliente sem custo de infraestrutura.
 */
export function createLocalDataSource(): DataSource {
  return {
    catalog: {
      async listCategories() {
        await delay(40);
        return readJSON<Category[]>(K.categories, () => seedCategories).sort((a, b) => a.sortOrder - b.sortOrder);
      },
      async saveCategory(input) {
        const list = readJSON<Category[]>(K.categories, () => seedCategories);
        const category: Category = { ...input, id: input.id ?? createId("cat-") };
        const idx = list.findIndex((c) => c.id === category.id);
        if (idx >= 0) list[idx] = category;
        else list.push(category);
        writeJSON(K.categories, list);
        return category;
      },
      async deleteCategory(id) {
        const inUse = readJSON<Product[]>(K.products, () => seedProducts).some((p) => p.categoryId === id);
        if (inUse) throw new Error("Existem produtos nesta categoria. Mova-os antes de excluir.");
        writeJSON(
          K.categories,
          readJSON<Category[]>(K.categories, () => seedCategories).filter((c) => c.id !== id),
        );
      },

      async listProducts(opts) {
        await delay(60);
        const list = readJSON<Product[]>(K.products, () => seedProducts);
        return (opts?.includeInactive ? list : list.filter((p) => p.active)).sort(sortProducts);
      },
      async getProduct(id) {
        await delay(30);
        return readJSON<Product[]>(K.products, () => seedProducts).find((p) => p.id === id) ?? null;
      },
      async saveProduct(input) {
        await delay(150);
        const list = readJSON<Product[]>(K.products, () => seedProducts);
        const product: Product = {
          ...input,
          id: input.id ?? createId("p-"),
          slug: slugify(input.name),
          updatedAt: new Date().toISOString(),
        };
        const idx = list.findIndex((p) => p.id === product.id);
        if (idx >= 0) list[idx] = product;
        else list.push(product);
        writeJSON(K.products, list);
        return product;
      },
      async deleteProduct(id) {
        writeJSON(
          K.products,
          readJSON<Product[]>(K.products, () => seedProducts).filter((p) => p.id !== id),
        );
      },
    },

    orders: {
      async list(filter) {
        await delay(60);
        let list = readOrders();
        if (filter?.status === "ativos") list = list.filter((o) => !["entregue", "cancelada"].includes(o.status));
        else if (filter?.status) list = list.filter((o) => o.status === filter.status);
        if (filter?.from) list = list.filter((o) => o.fulfillment.date >= filter.from!);
        if (filter?.to) list = list.filter((o) => o.fulfillment.date <= filter.to!);
        if (filter?.search) {
          const q = filter.search.toLowerCase();
          list = list.filter(
            (o) =>
              o.code.toLowerCase().includes(q) ||
              o.customer.name.toLowerCase().includes(q) ||
              o.customer.phone.includes(q.replace(/\D/g, "") || "§"),
          );
        }
        return list.sort((a, b) =>
          a.fulfillment.date === b.fulfillment.date
            ? a.fulfillment.timeSlot.localeCompare(b.fulfillment.timeSlot)
            : a.fulfillment.date.localeCompare(b.fulfillment.date),
        );
      },
      async get(id) {
        await delay(30);
        return readOrders().find((o) => o.id === id) ?? null;
      },
      async getByCode(code) {
        await delay(60);
        return readOrders().find((o) => o.code.toLowerCase() === code.toLowerCase()) ?? null;
      },
      async create(input, totals) {
        await delay(400);
        const createdAt = new Date().toISOString();
        const order: Order = {
          id: createId("o-"),
          code: nextOrderCode(),
          createdAt,
          status: "recebida",
          customer: input.customer,
          fulfillment: input.fulfillment,
          items: input.items,
          notes: input.notes,
          ...totals,
          history: [{ status: "recebida", at: createdAt }],
          notifications: [],
          channel: input.channel ?? "site",
        };
        writeJSON(K.orders, [...readOrders(), order]);
        return order;
      },
      async updateStatus(id, status, note) {
        await delay(120);
        const list = readOrders();
        const idx = list.findIndex((o) => o.id === id);
        if (idx < 0) throw new Error("Pedido não encontrado");
        const updated: Order = {
          ...list[idx],
          status,
          history: [...list[idx].history, { status, at: new Date().toISOString(), note }],
        };
        list[idx] = updated;
        writeJSON(K.orders, list);
        return updated;
      },
      async appendNotifications(id, logs) {
        const list = readOrders();
        const idx = list.findIndex((o) => o.id === id);
        if (idx < 0) return;
        list[idx] = { ...list[idx], notifications: [...list[idx].notifications, ...logs] };
        writeJSON(K.orders, list);
      },
    },

    settings: {
      async get() {
        await delay(30);
        return { ...seedSettings, ...readJSON<BusinessSettings>(K.settings, () => seedSettings) };
      },
      async save(settings) {
        await delay(200);
        writeJSON(K.settings, settings);
        return settings;
      },
    },

    content: {
      async listTestimonials() {
        return readJSON<Testimonial[]>(K.testimonials, () => seedTestimonials);
      },
    },

    instagram: {
      async latestPosts(limit) {
        await delay(80);
        return seedInstagram.slice(0, limit);
      },
    },

    async resetDemo() {
      Object.values(K).forEach(removeKey);
      notify("products");
      notify("categories");
      notify("orders");
      notify("settings");
      notify("content");
    },
  };
}
