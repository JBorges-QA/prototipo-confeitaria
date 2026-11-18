/**
 * Dados de demonstração. Fotos: Unsplash (uso livre) — substituir pelas
 * fotos reais da confeitaria pelo próprio painel administrativo.
 */
import type { Category, Product } from "@/domain/catalog";
import type { Order, OrderStatus } from "@/domain/order";
import type { BusinessSettings, InstagramPost, Testimonial } from "@/domain/settings";
import { addDays, toDateKey } from "@/lib/dates";

export const photo = (id: string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;

export const PHOTOS = {
  chocolateCake: "1578985545062-69928b1d9587",
  strawberryCupcakes: "1563729784474-d77dbb933a9e",
  strawberryCups: "1488477181946-6428a0291777",
  confettiCake: "1464349095431-e9a21285b5f3",
  nakedCake: "1535141192574-5d4897c12636",
  brownie: "1606313564200-e75d5e30476c",
  cookies: "1558961363-fa8fdf82db35",
  tiramisu: "1571115177098-24ec42ed204d",
  mintCupcakes: "1486427944299-d1955d23e34d",
  floralCake: "1559620192-032c4bc4674e",
  mintCupcake: "1587668178277-295251f900ce",
  oreoCake: "1557925923-cd4648e211a0",
  dripCake: "1621303837174-89787a7d4729",
  oreoCupcakes: "1612203985729-70726954388c",
  chocolateCupcake: "1550617931-e17a7b70dce2",
  raspberrySlice: "1565958011703-44f9829ba187",
  vanillaCupcakes: "1519869325930-281384150729",
  colorCupcakes: "1607478900766-efe13248b125",
  cherryCupcake: "1599785209707-a456fc1337bb",
  redVelvet: "1551879400-111a9087cd86",
  macaronCake: "1562440499-64c9a111f713",
  passionTart: "1576618148400-f54bed99fcfd",
} as const;

export const seedCategories: Category[] = [
  { id: "cat-bolos", name: "Bolos", description: "Vendidos por quilo · massa e recheio à sua escolha", sortOrder: 1 },
  { id: "cat-doces", name: "Doces de festa", description: "Docinhos finos para mesas de festa", sortOrder: 2 },
  { id: "cat-cupcakes", name: "Cupcakes", description: "Decorados um a um", sortOrder: 3 },
  { id: "cat-tortas", name: "Tortas & sobremesas", description: "Inteiras, aro 20 cm (serve ~12 fatias)", sortOrder: 4 },
  { id: "cat-presentes", name: "Caixas & presentes", description: "Para presentear (ou se presentear)", sortOrder: 5 },
];

const now = new Date().toISOString();

type SeedProduct = Omit<Product, "slug" | "updatedAt" | "tags" | "sortOrder" | "active" | "featured"> &
  Partial<Pick<Product, "tags" | "featured" | "active">>;

const BOLO_RECHEIOS = ["Brigadeiro belga", "Ninho com morango", "Doce de leite com nozes", "Frutas vermelhas", "Prestígio"];

const raw: SeedProduct[] = [
  // Bolos
  { id: "p-naked", name: "Naked Cake Frutas Vermelhas", description: "Massa de baunilha, creme de mascarpone e frutas vermelhas frescas. O queridinho dos casamentos e aniversários ao ar livre.", categoryId: "cat-bolos", price: 13500, unit: "kg", minQuantity: 2, quantityStep: 0.5, flavors: ["Mascarpone com frutas vermelhas", "Ninho com morango", "Limão siciliano"], images: [photo(PHOTOS.nakedCake)], featured: true, tags: ["mais pedido"] },
  { id: "p-trufado", name: "Bolo Trufado de Chocolate", description: "Massa de cacau 50%, recheio de trufa cremosa e cobertura de ganache com bicos de chocolate.", categoryId: "cat-bolos", price: 12000, unit: "kg", minQuantity: 1.5, quantityStep: 0.5, flavors: ["Trufa ao leite", "Trufa meio amargo", "Brigadeiro belga"], images: [photo(PHOTOS.chocolateCake)], featured: true },
  { id: "p-macaron", name: "Bolo Macarons & Chantilly", description: "Decoração em tons pastel com macarons artesanais, drip de chocolate branco e chantilly estabilizado.", categoryId: "cat-bolos", price: 16000, unit: "kg", minQuantity: 2, quantityStep: 0.5, flavors: BOLO_RECHEIOS, images: [photo(PHOTOS.macaronCake)], featured: true, tags: ["novidade"] },
  { id: "p-drip", name: "Drip Cake Rosé", description: "Massa amanteigada com confeitos, drip de ganache rosé e topo decorado. Perfeito para festas infantis.", categoryId: "cat-bolos", price: 14500, unit: "kg", minQuantity: 2, quantityStep: 0.5, flavors: BOLO_RECHEIOS, images: [photo(PHOTOS.dripCake)] },
  { id: "p-floral", name: "Bolo Floral Amora & Lavanda", description: "Massa leve de baunilha, creme de amora e decoração com flores comestíveis.", categoryId: "cat-bolos", price: 15000, unit: "kg", minQuantity: 2, quantityStep: 0.5, flavors: ["Amora com lavanda", "Frutas vermelhas"], images: [photo(PHOTOS.floralCake)] },
  { id: "p-oreo", name: "Bolo Cookies & Cream", description: "Massa de chocolate, recheio cremoso de Oreo e cobertura de ganache com biscoitos.", categoryId: "cat-bolos", price: 13000, unit: "kg", minQuantity: 1.5, quantityStep: 0.5, flavors: ["Cookies & cream"], images: [photo(PHOTOS.oreoCake)] },
  { id: "p-confetti", name: "Bolo Confetti", description: "Massa colorida com granulado, recheio de brigadeiro branco e cobertura de confeitos crocantes.", categoryId: "cat-bolos", price: 12500, unit: "kg", minQuantity: 1.5, quantityStep: 0.5, flavors: ["Brigadeiro branco", "Ninho"], images: [photo(PHOTOS.confettiCake)] },

  // Doces de festa
  { id: "p-brigadeiro", name: "Brigadeiro Gourmet", description: "Feito com chocolate belga 54% e finalizado com granulado belga. Em forminhas de papel.", categoryId: "cat-doces", price: 320, unit: "unidade", minQuantity: 25, quantityStep: 5, flavors: ["Tradicional", "Ninho", "Pistache", "Churros", "Café"], images: [], featured: false, tags: ["mais pedido"] },
  { id: "p-beijinho", name: "Beijinho de Coco", description: "Coco fresco ralado, leite condensado e cravo. Clássico que nunca falha.", categoryId: "cat-doces", price: 300, unit: "unidade", minQuantity: 25, quantityStep: 5, flavors: [], images: [] },
  { id: "p-copinho", name: "Copinho de Morango com Creme", description: "Creme de baunilha com morangos frescos em copinho de acrílico com colher.", categoryId: "cat-doces", price: 650, unit: "unidade", minQuantity: 20, quantityStep: 5, flavors: [], images: [photo(PHOTOS.strawberryCups)], featured: true },

  // Cupcakes
  { id: "p-cup-berries", name: "Cupcake Red Berries", description: "Massa de baunilha, recheio de geleia de morango e frosting de cream cheese.", categoryId: "cat-cupcakes", price: 900, unit: "unidade", minQuantity: 6, quantityStep: 1, flavors: [], images: [photo(PHOTOS.strawberryCupcakes)] },
  { id: "p-cup-belga", name: "Cupcake Chocolate Belga", description: "Massa úmida de chocolate, recheio de brigadeiro e frosting de chocolate belga.", categoryId: "cat-cupcakes", price: 950, unit: "unidade", minQuantity: 6, quantityStep: 1, flavors: [], images: [photo(PHOTOS.chocolateCupcake)] },
  { id: "p-cup-oreo", name: "Cupcake Oreo", description: "Massa black cocoa com pedaços de biscoito e frosting cookies & cream.", categoryId: "cat-cupcakes", price: 950, unit: "unidade", minQuantity: 6, quantityStep: 1, flavors: [], images: [photo(PHOTOS.oreoCupcakes)] },
  { id: "p-cup-confetti", name: "Cupcake Confetti", description: "Baunilha com confeitos coloridos e frosting de chantininho. Sucesso garantido com as crianças.", categoryId: "cat-cupcakes", price: 850, unit: "unidade", minQuantity: 6, quantityStep: 1, flavors: [], images: [photo(PHOTOS.colorCupcakes)] },

  // Tortas
  { id: "p-maracuja", name: "Torta Mousse de Maracujá", description: "Base crocante amanteigada, mousse aerado de maracujá e espelho da fruta.", categoryId: "cat-tortas", price: 9500, unit: "unidade", minQuantity: 1, quantityStep: 1, flavors: [], images: [photo(PHOTOS.passionTart)] },
  { id: "p-tiramisu", name: "Torta Tiramisù", description: "Camadas de pão de ló embebido em café, creme de mascarpone e cacau.", categoryId: "cat-tortas", price: 11500, unit: "unidade", minQuantity: 1, quantityStep: 1, flavors: [], images: [photo(PHOTOS.tiramisu)] },
  { id: "p-framboesa", name: "Torta Framboesa & Baunilha", description: "Pão de ló, creme diplomata de baunilha e framboesas frescas.", categoryId: "cat-tortas", price: 12000, unit: "unidade", minQuantity: 1, quantityStep: 1, flavors: [], images: [photo(PHOTOS.raspberrySlice)] },
  { id: "p-redvelvet", name: "Torta Red Velvet", description: "Massa aveludada, recheio de cream cheese e geleia de frutas vermelhas.", categoryId: "cat-tortas", price: 11000, unit: "unidade", minQuantity: 1, quantityStep: 1, flavors: [], images: [photo(PHOTOS.redVelvet)] },

  // Presentes
  { id: "p-cookies", name: "Caixa de Cookies (6 un.)", description: "Cookies de manteiga tostada com gotas de chocolate meio amargo. Embalagem presenteável.", categoryId: "cat-presentes", price: 4200, unit: "caixa", minQuantity: 1, quantityStep: 1, flavors: ["Chocolate meio amargo", "Red velvet", "Mix"], images: [photo(PHOTOS.cookies)] },
  { id: "p-brownie", name: "Caixa de Brownies (6 un.)", description: "Brownie fudge com casquinha crocante e calda de chocolate. Laço e cartão inclusos.", categoryId: "cat-presentes", price: 4800, unit: "caixa", minQuantity: 1, quantityStep: 1, flavors: ["Tradicional", "Com nozes", "Doce de leite"], images: [photo(PHOTOS.brownie)] },
];

export const seedProducts: Product[] = raw.map((p, i) => ({
  ...p,
  slug: p.id.replace(/^p-/, ""),
  tags: p.tags ?? [],
  featured: p.featured ?? false,
  active: p.active ?? true,
  sortOrder: i,
  updatedAt: now,
}));

export const seedSettings: BusinessSettings = {
  businessName: "Flor de Açúcar · Ateliê de Doces",
  ownerName: "Marina",
  whatsapp: "5511999990000",
  instagram: "flordeacucar.atelie",
  email: "contato@flordeacucar.com.br",
  pickupAddress: "Rua das Hortênsias, 120 — Vila Mariana, São Paulo/SP",
  serviceArea: "Entregamos na zona sul e centro de São Paulo",
  openingHours: "Terça a sábado, das 9h às 18h",
  minLeadDays: 2,
  closedWeekdays: [0, 1],
  timeSlots: ["09h às 12h", "13h às 15h", "15h às 18h"],
  deliveryEnabled: true,
  pickupEnabled: true,
  deliveryFee: 1800,
  minOrderValue: 5000,
  about: {
    title: "Oi, eu sou a Marina!",
    text:
      "A Flor de Açúcar nasceu na cozinha da minha avó, entre cadernos de receitas manchados de chocolate e muito carinho. Hoje transformo ingredientes selecionados em bolos e doces que fazem parte dos momentos mais especiais da sua vida.\n\nCada encomenda é feita à mão, em pequenas quantidades, sem conservantes — do jeitinho que eu faria para a minha família.",
    image: photo(PHOTOS.cherryCupcake, 900),
  },
};

export const seedTestimonials: Testimonial[] = [
  { id: "t1", name: "Juliana Prado", occasion: "Casamento", text: "O naked cake foi o assunto da festa! Lindo, delicado e o recheio de frutas vermelhas estava perfeito. Atendimento impecável do começo ao fim.", rating: 5 },
  { id: "t2", name: "Rafael Moura", occasion: "Aniversário de 1 ano", text: "Encomendei bolo e 200 docinhos. Chegou tudo no horário, embalado com muito cuidado. Os brigadeiros de pistache acabaram em minutos.", rating: 5 },
  { id: "t3", name: "Camila Torres", occasion: "Chá de bebê", text: "Fiz o pedido pelo site em 2 minutos e recebi a confirmação no WhatsApp. Praticidade e sabor de verdade!", rating: 5 },
  { id: "t4", name: "Fernanda Lima", occasion: "Presente corporativo", text: "As caixas de brownies foram um sucesso com nossos clientes. Embalagem caprichada e sabor inesquecível.", rating: 5 },
];

export const seedInstagram: InstagramPost[] = [
  PHOTOS.macaronCake,
  PHOTOS.strawberryCupcakes,
  PHOTOS.floralCake,
  PHOTOS.strawberryCups,
  PHOTOS.dripCake,
  PHOTOS.chocolateCupcake,
  PHOTOS.passionTart,
  PHOTOS.mintCupcakes,
  PHOTOS.raspberrySlice,
].map((id, i) => ({
  id: `ig-${i}`,
  imageUrl: photo(id, 500),
  caption: "Feito à mão, com carinho 🌸",
  permalink: "https://instagram.com/",
  likes: 120 + ((i * 37) % 180),
}));

/* ---------------------------------------------------------------- Pedidos */

const CUSTOMERS = [
  { name: "Ana Beatriz Souza", phone: "11987654321" },
  { name: "Carlos Henrique Dias", phone: "11976543210" },
  { name: "Patrícia Gomes", phone: "11965432109" },
  { name: "Luana Ferreira", phone: "11954321098" },
  { name: "Marcos Vinícius", phone: "11943210987" },
  { name: "Beatriz Almeida", phone: "11932109876" },
  { name: "Renata Oliveira", phone: "11921098765" },
  { name: "Thiago Martins", phone: "11910987654" },
  { name: "Gabriela Rocha", phone: "11998761234" },
  { name: "Sofia Castro", phone: "11987612345" },
];

const byId = (id: string) => seedProducts.find((p) => p.id === id)!;
const line = (id: string, quantity: number, flavor?: string) => {
  const p = byId(id);
  return { productId: p.id, name: p.name, unit: p.unit, unitPrice: p.price, quantity, flavor, image: p.images[0] };
};

/** Gera pedidos relativos à data atual para o painel sempre parecer "vivo". */
export function buildSeedOrders(today = new Date()): { orders: Order[]; nextNumber: number } {
  const plan: Array<{ day: number; status: OrderStatus; type: "entrega" | "retirada"; items: ReturnType<typeof line>[]; notes?: string }> = [
    { day: -3, status: "entregue", type: "entrega", items: [line("p-naked", 2.5, "Mascarpone com frutas vermelhas"), line("p-brigadeiro", 100, "Pistache")] },
    { day: -1, status: "entregue", type: "retirada", items: [line("p-cookies", 3, "Mix")] },
    { day: 0, status: "pronta", type: "retirada", items: [line("p-trufado", 2, "Trufa meio amargo")], notes: "Escrever 'Feliz aniversário, Pedro!' no topo." },
    { day: 0, status: "em_producao", type: "entrega", items: [line("p-cup-berries", 12), line("p-copinho", 30)] },
    { day: 1, status: "em_producao", type: "entrega", items: [line("p-macaron", 3, "Ninho com morango"), line("p-brigadeiro", 150, "Tradicional"), line("p-beijinho", 50)], notes: "Festa de 15 anos — tons de rosa e dourado." },
    { day: 2, status: "confirmada", type: "retirada", items: [line("p-tiramisu", 1), line("p-maracuja", 1)] },
    { day: 3, status: "confirmada", type: "entrega", items: [line("p-drip", 2, "Brigadeiro belga"), line("p-cup-confetti", 12)] },
    { day: 3, status: "recebida", type: "retirada", items: [line("p-brownie", 4, "Com nozes")], notes: "Presente corporativo — cartões com logo da empresa." },
    { day: 4, status: "recebida", type: "entrega", items: [line("p-floral", 2, "Amora com lavanda")] },
    { day: 5, status: "recebida", type: "entrega", items: [line("p-naked", 3, "Limão siciliano"), line("p-copinho", 40)] },
  ];

  let n = 1031;
  const slots = seedSettings.timeSlots;
  const orders: Order[] = plan.map((o, i) => {
    const subtotal = o.items.reduce((s, it) => s + Math.round(it.unitPrice * it.quantity), 0);
    const deliveryFee = o.type === "entrega" ? seedSettings.deliveryFee : 0;
    const createdAt = addDays(today, o.day - 4 - (i % 3));
    createdAt.setHours(9 + (i % 9), (i * 13) % 60);
    const statuses = ["recebida", "confirmada", "em_producao", "pronta", "entregue"] as OrderStatus[];
    const history = statuses.slice(0, statuses.indexOf(o.status) + 1).map((status, k) => ({
      status,
      at: new Date(createdAt.getTime() + k * 1000 * 60 * 60 * 20).toISOString(),
    }));
    const c = CUSTOMERS[i % CUSTOMERS.length];
    return {
      id: `o-seed-${i}`,
      code: `FA-${n++}`,
      createdAt: createdAt.toISOString(),
      status: o.status,
      customer: { name: c.name, phone: c.phone },
      fulfillment: {
        type: o.type,
        date: toDateKey(addDays(today, o.day)),
        timeSlot: slots[i % slots.length],
        address: o.type === "entrega" ? `Rua Exemplo, ${100 + i * 17} — Moema, São Paulo/SP` : undefined,
      },
      items: o.items,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      notes: o.notes,
      history,
      notifications: [],
      channel: i % 4 === 0 ? "whatsapp" : "site",
    };
  });

  return { orders, nextNumber: n };
}
