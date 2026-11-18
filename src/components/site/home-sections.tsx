"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Heart, Quote, Star } from "lucide-react";
import type { Product } from "@/domain/catalog";
import { useCategories, useProducts, useQuery, useSettings } from "@/data/hooks";
import { InstagramIcon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/button";
import { SectionTitle, Skeleton } from "@/components/ui/misc";
import { ProductCard } from "./product-card";
import { ProductSheet } from "./product-sheet";

export function CategoryShortcuts() {
  const { data: categories } = useCategories();
  return (
    <section className="border-y border-cocoa-900/[0.06] bg-white/60">
      <div className="container-page scrollbar-none flex gap-2 overflow-x-auto py-4 sm:justify-center">
        {(categories ?? []).map((c) => (
          <Link
            key={c.id}
            href={`/cardapio#${c.id}`}
            className="shrink-0 rounded-full border border-cocoa-900/10 bg-white px-4 py-2 text-sm font-semibold text-cocoa-700 transition hover:border-rose-400 hover:text-rose-600"
          >
            {c.name}
          </Link>
        ))}
        {!categories && Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-9 w-28 shrink-0 rounded-full" />)}
      </div>
    </section>
  );
}

export function FeaturedProducts() {
  const { data: products } = useProducts();
  const [selected, setSelected] = useState<Product | null>(null);
  const featured = (products ?? []).filter((p) => p.featured).slice(0, 4);

  return (
    <section className="py-16 sm:py-20">
      <div className="container-page">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionTitle
            align="left"
            eyebrow="Destaques"
            title="Os queridinhos do ateliê"
            description="Receitas autorais que conquistaram nossos clientes — perfeitas para aniversários, casamentos e qualquer motivo para comemorar."
          />
          <Link href="/cardapio" className="inline-flex items-center gap-1.5 text-sm font-bold whitespace-nowrap text-rose-600">
            Ver cardápio completo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {products
            ? featured.map((p) => <ProductCard key={p.id} product={p} onSelect={setSelected} />)
            : Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />)}
        </div>
      </div>
      <ProductSheet product={selected} onClose={() => setSelected(null)} />
    </section>
  );
}

export function AboutSection() {
  const { data: s } = useSettings();
  return (
    <section id="sobre" className="scroll-mt-20 overflow-hidden bg-blush-100/70 py-16 sm:py-24">
      <div className="container-page grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
          <div className="absolute -inset-3 rotate-[-4deg] rounded-[2.5rem] border-2 border-dashed border-rose-400/40" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-blush-200 shadow-lift">
            {s && <Image src={s.about.image} alt={s.about.title} fill sizes="420px" className="object-cover" unoptimized={s.about.image.startsWith("data:")} />}
          </div>
          <div className="absolute -right-4 -bottom-4 grid h-24 w-24 place-items-center rounded-full bg-cocoa-900 text-center text-cream-50 shadow-lift">
            <span className="text-[0.65rem] leading-tight font-bold tracking-wider uppercase">
              <span className="block font-display text-2xl tracking-normal normal-case italic">+8</span>
              anos de<br />ateliê
            </span>
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-bold tracking-[0.22em] text-rose-500 uppercase">Sobre mim</p>
          {s ? (
            <>
              <h2 className="text-3xl font-medium sm:text-4xl">{s.about.title}</h2>
              <div className="mt-5 space-y-4 text-[1.02rem] leading-relaxed text-cocoa-500">
                {s.about.text.split("\n").filter(Boolean).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <Skeleton className="h-10 w-2/3" />
              <Skeleton className="h-24 w-full" />
            </div>
          )}
          <ul className="mt-8 grid grid-cols-2 gap-3 text-sm font-semibold text-cocoa-700">
            {["Ingredientes selecionados", "Sem conservantes", "Receitas autorais", "Embalagem presenteável"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Heart className="h-4 w-4 shrink-0 fill-rose-400 text-rose-400" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  const { data } = useQuery((ds) => ds.content.listTestimonials(), [], ["content"]);
  return (
    <section id="depoimentos" className="scroll-mt-20 py-16 sm:py-24">
      <div className="container-page">
        <SectionTitle eyebrow="Depoimentos" title="Quem prova, recomenda" />
        <div className="scrollbar-none -mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {(data ?? []).map((t) => (
            <figure
              key={t.id}
              className="flex w-[82%] shrink-0 snap-center flex-col rounded-3xl border border-cocoa-900/[0.07] bg-white p-6 shadow-soft sm:w-auto"
            >
              <Quote className="h-7 w-7 text-blush-300" />
              <div className="mt-3 flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold-500 text-gold-500" />
                ))}
              </div>
              <blockquote className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-cocoa-700">{t.text}</blockquote>
              <figcaption className="mt-5 border-t border-cocoa-900/[0.06] pt-4">
                <p className="font-bold text-cocoa-900">{t.name}</p>
                <p className="text-xs text-cocoa-400">{t.occasion}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function InstagramSection() {
  const { data: posts } = useQuery((ds) => ds.instagram.latestPosts(9), [], []);
  const { data: s } = useSettings();
  const handle = s?.instagram ?? "";
  return (
    <section className="pb-16 sm:pb-24">
      <div className="container-page">
        <div className="flex flex-col items-center text-center">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-linear-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white">
            <InstagramIcon className="h-6 w-6" />
          </span>
          <h2 className="mt-4 text-3xl font-medium sm:text-4xl">@{handle}</h2>
          <p className="mt-2 text-cocoa-500">Acompanhe as novidades e os bastidores do ateliê</p>
        </div>
        <div className="mt-8 grid grid-cols-3 gap-1.5 sm:gap-3">
          {(posts ?? Array.from({ length: 9 }).map(() => null)).map((p, i) =>
            p ? (
              <a
                key={p.id}
                href={`https://instagram.com/${handle}`}
                target="_blank"
                rel="noreferrer"
                className={`group relative aspect-square overflow-hidden rounded-lg sm:rounded-2xl ${i >= 6 ? "hidden sm:block" : ""}`}
              >
                <Image src={p.imageUrl} alt={p.caption} fill sizes="(max-width:640px) 33vw, 380px" className="object-cover transition duration-500 group-hover:scale-105" />
                <span className="absolute inset-0 flex items-center justify-center gap-1.5 bg-cocoa-900/40 text-sm font-bold text-white opacity-0 transition group-hover:opacity-100">
                  <Heart className="h-4 w-4 fill-white" /> {p.likes}
                </span>
              </a>
            ) : (
              <Skeleton key={i} className="aspect-square rounded-lg sm:rounded-2xl" />
            ),
          )}
        </div>
        <div className="mt-8 text-center">
          <ButtonLink href={`https://instagram.com/${handle}`} target="_blank" variant="outline">
            <InstagramIcon className="h-4 w-4" /> Seguir no Instagram
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
