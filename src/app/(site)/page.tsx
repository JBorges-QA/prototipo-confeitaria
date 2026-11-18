import Image from "next/image";
import { ArrowRight, CalendarHeart, Heart, Leaf, Sparkles, Star, Truck } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { SectionTitle } from "@/components/ui/misc";
import {
  AboutSection,
  CategoryShortcuts,
  FeaturedProducts,
  InstagramSection,
  Testimonials,
} from "@/components/site/home-sections";
import { photo, PHOTOS } from "@/data/seed";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryShortcuts />
      <FeaturedProducts />
      <HowItWorks />
      <AboutSection />
      <Testimonials />
      <InstagramSection />
      <FinalCta />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-blush-200/60 blur-3xl" />
      <div className="pointer-events-none absolute top-60 -left-40 h-80 w-80 rounded-full bg-gold-300/25 blur-3xl" />

      <div className="container-page relative grid items-center gap-10 pt-6 pb-14 sm:pt-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pt-14 lg:pb-24">
        <div className="animate-fade-up">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3.5 py-1.5 text-xs font-bold tracking-wide text-rose-600 shadow-soft">
            <Sparkles className="h-3.5 w-3.5" /> Confeitaria artesanal por encomenda
          </p>
          <h1 className="mt-5 text-[2.6rem] leading-[1.05] font-medium text-cocoa-900 sm:text-6xl lg:text-[4.2rem]">
            Doces feitos à mão para <em className="text-rose-500">celebrar</em> o que importa
          </h1>
          <p className="mt-5 max-w-xl text-[1.05rem] leading-relaxed text-cocoa-500">
            Bolos, docinhos finos e sobremesas preparados em pequenas fornadas, com ingredientes selecionados. Monte seu
            pedido em poucos minutos e escolha a data de entrega ou retirada.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/cardapio" size="lg">
              Montar meu pedido <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/#sobre" size="lg" variant="outline">
              Conheça o ateliê
            </ButtonLink>
          </div>
          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-cocoa-900/10 pt-6">
            {[
              { icon: Star, k: "5,0", v: "+300 avaliações" },
              { icon: CalendarHeart, k: "48h", v: "de antecedência" },
              { icon: Truck, k: "Entrega", v: "ou retirada" },
            ].map(({ icon: Icon, k, v }) => (
              <div key={v}>
                <dt className="flex items-center gap-1.5 text-lg font-extrabold text-cocoa-900">
                  <Icon className="h-4 w-4 text-gold-500" />
                  {k}
                </dt>
                <dd className="text-xs text-cocoa-400 sm:text-sm">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[2.5rem] shadow-lift ring-8 ring-white">
            <Image
              src={photo(PHOTOS.nakedCake, 1100)}
              alt="Naked cake com frutas vermelhas"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 520px"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-5 -left-3 flex items-center gap-3 rounded-2xl bg-white p-3 pr-5 shadow-lift sm:-left-8">
            <div className="relative h-14 w-14 overflow-hidden rounded-xl">
              <Image src={photo(PHOTOS.strawberryCupcakes, 200)} alt="" fill sizes="56px" className="object-cover" />
            </div>
            <div>
              <p className="text-xs font-semibold text-cocoa-400">Mais pedido da semana</p>
              <p className="font-display text-base font-medium">Naked Cake Frutas Vermelhas</p>
            </div>
          </div>
          <div className="absolute top-8 -right-2 hidden items-center gap-2 rounded-full bg-cocoa-900 px-4 py-2 text-sm font-semibold text-cream-50 shadow-lift sm:flex">
            <Heart className="h-4 w-4 fill-rose-400 text-rose-400" /> Feito com amor
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: Sparkles, title: "Escolha seus doces", text: "Navegue pelo cardápio, selecione sabores e quantidades." },
    { icon: CalendarHeart, title: "Defina data e horário", text: "Escolha entrega ou retirada respeitando 48h de antecedência." },
    { icon: Leaf, title: "Receba no WhatsApp", text: "Confirmamos seu pedido e você acompanha cada etapa." },
  ];
  return (
    <section className="py-16 sm:py-20">
      <div className="container-page">
        <SectionTitle eyebrow="Como funciona" title="Seu pedido em 3 passos" />
        <ol className="mt-10 grid gap-4 sm:grid-cols-3 sm:gap-6">
          {steps.map((s, i) => (
            <li key={s.title} className="relative rounded-3xl border border-cocoa-900/[0.07] bg-white p-6 shadow-soft">
              <span className="absolute top-5 right-6 font-display text-5xl text-blush-200 italic">{i + 1}</span>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blush-100 text-rose-500">
                <s.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-xl font-medium">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-cocoa-500">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="container-page pb-20">
      <div className="relative overflow-hidden rounded-[2rem] bg-rose-500 px-6 py-12 text-center text-white sm:px-12 sm:py-16">
        <div className="pointer-events-none absolute -top-16 -left-16 h-56 w-56 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -right-10 -bottom-20 h-64 w-64 rounded-full bg-gold-300/25" />
        <h2 className="relative text-3xl font-medium sm:text-5xl">Tem uma festa chegando?</h2>
        <p className="relative mx-auto mt-3 max-w-lg text-white/85">
          Garanta sua data: agendas de fim de semana costumam fechar rápido.
        </p>
        <ButtonLink href="/cardapio" size="lg" variant="secondary" className="relative mt-8">
          Fazer meu pedido agora <ArrowRight className="h-4 w-4" />
        </ButtonLink>
      </div>
    </section>
  );
}
