# Flor de Açúcar · Ateliê de Doces

Site de pedidos online + painel de encomendas para confeitaria artesanal.
Esta versão é uma **demonstração funcional para o cliente**: todo o fluxo funciona de ponta a ponta,
com os dados salvos no próprio navegador e as integrações (WhatsApp / Instagram) simuladas.

> O nome **Flor de Açúcar** e o logotipo são provisórios. A logo definitiva do cliente substitui
> o componente `<Logo />` em `src/components/brand.tsx` — todas as telas usam esse componente.

**Demonstração online:** publicada na Netlify (painel em `/admin` — `admin@flordeacucar.com.br` / `doce2026`)

## Como rodar

```bash
npm install
npm run dev
```

Acesse http://localhost:3000.
Painel: http://localhost:3000/admin — `admin@flordeacucar.com.br` / senha `doce2026` (somente demonstração; configurável em `.env.local`).

Outros comandos: `npm run build` (build de produção) · `npm run lint`.

### Publicação da demonstração (Netlify)

O repositório está conectado à Netlify: a cada push na `main` ela roda o build definido em
[`netlify.toml`](netlify.toml), que gera um site estático (`STATIC_EXPORT=true`, pasta `out/`) e publica.
Para testar a mesma versão localmente: `STATIC_EXPORT=true npm run build` e sirva a pasta `out/`.
Como a demo não tem servidor, os identificadores vão na query string
(`/acompanhar?codigo=FA-1041`, `/admin/encomendas/detalhe?id=…`). Todas as URLs são montadas em
[`src/config/routes.ts`](src/config/routes.ts), então voltar a rotas como `/pedido/[codigo]` na versão
com servidor é uma mudança em um único arquivo.

### Roteiro sugerido para a apresentação

1. Abra o site no celular (ou no modo mobile do navegador) — home, cardápio e busca.
2. Monte um pedido: escolha sabor/quantidade, finalize com data, horário e entrega.
3. Veja a tela de confirmação com a **prévia da mensagem do WhatsApp** e o acompanhamento.
4. Em outra aba, abra `/admin`: o pedido aparece em tempo real (sincronização entre abas).
5. Atualize o status, veja a **agenda da semana** e a **lista de produção**.
6. Edite um produto (preço, foto, sabores) e confira a mudança no cardápio.
7. Mostre a página `/links` — o link para colocar na bio do Instagram.
8. Em **Ajustes → Restaurar demonstração** os dados voltam ao estado inicial.

## O que está pronto

**Site do cliente (mobile-first)**
- Home: hero, destaques, como funciona, “Sobre mim” (editável), depoimentos, feed do Instagram, CTA
- Cardápio por categoria com abas fixas, scroll-spy e busca por nome/sabor
- Detalhe do produto com escolha de sabor/recheio e quantidade (kg, unidades, caixas, mínimos)
- Carrinho persistente (gaveta + barra fixa no celular)
- Checkout: entrega ou retirada, datas respeitando antecedência mínima e dias fechados, horários, validação
- Confirmação e acompanhamento do pedido por código (linha do tempo de status)
- Página “link na bio” (`/links`) para o Instagram

**Painel administrativo**
- Login (demonstração) e layout responsivo (sidebar no desktop, navegação inferior no celular)
- Dashboard: novos pedidos, entregas do dia, em produção, faturamento previsto da semana
- Encomendas: filtros por status, busca por nome/código/telefone
- Detalhe: itens, valores, contato (botão de WhatsApp e ligação), atualização de status com nota interna, histórico, ficha para impressão, log das mensagens automáticas
- Agenda semanal + lista de produção consolidada (ex.: “150 brigadeiros pistache, 3 kg de naked cake”)
- Cardápio: cadastro/edição de produtos, fotos (upload com compressão automática), sabores, unidade de venda, mínimos, destaque, ocultar/mostrar, categorias com ordenação
- Ajustes: dados do negócio, WhatsApp, Instagram, antecedência, dias sem atendimento, horários, taxa de entrega, pedido mínimo, texto e foto do “Sobre mim”

**Simulado nesta versão** (interface pronta, integração na próxima etapa)
- Envio automático do pedido para o WhatsApp da confeitaria e confirmação ao cliente (as mensagens são geradas e registradas no pedido)
- Feed do Instagram (fotos de exemplo)
- Persistência em servidor e autenticação real

## Arquitetura

```
src/
├── app/                      # Rotas (Next.js App Router)
│   ├── (site)/               # Site público: home, cardápio, pedido, acompanhamento
│   ├── links/                # Página "link na bio"
│   └── admin/                # Login + (painel)/ dashboard, encomendas, agenda, produtos, ajustes
├── domain/                   # Tipos e regras do negócio (Product, Order, Settings) + schemas Zod
├── data/
│   ├── contracts.ts          # Interfaces dos repositórios (CatalogRepository, OrderRepository…)
│   ├── index.ts              # Fábrica: escolhe a implementação via NEXT_PUBLIC_DATA_SOURCE
│   ├── hooks.ts              # useQuery/useProducts/useSettings com revalidação automática
│   ├── local/                # Implementação de demonstração (localStorage)
│   └── seed.ts               # Dados iniciais
├── features/                 # Casos de uso: cart, orders (preço, finalizar pedido), notifications, auth
├── components/               # UI: ui/ (primitivos), site/, admin/
├── config/site.ts            # Marca e constantes
└── lib/                      # utilitários (moeda, datas, imagem)
```

**Princípios que garantem a escalabilidade**

- **Telas não conhecem a origem dos dados.** Tudo passa pelas interfaces de `src/data/contracts.ts`.
  Para produção cria-se `data/api/` (ex.: Supabase/Postgres ou rotas `/api` com Prisma) implementando
  os mesmos contratos e troca-se `NEXT_PUBLIC_DATA_SOURCE=api`. Nenhuma tela muda.
- **Regras de negócio isoladas** em `domain/` e `features/` (cálculo de totais, validação do checkout com Zod,
  caso de uso `placeOrder`). Os mesmos schemas serão reutilizados no servidor.
- **Integrações atrás de interfaces**: `NotificationGateway` (WhatsApp) e `InstagramFeedProvider`
  já existem com implementações simuladas; a versão real é plugada sem alterar as telas.
- **Valores monetários em centavos** (inteiros) — sem erros de arredondamento.
- **Identidade visual em tokens** (`src/app/globals.css`): cores e fontes ajustáveis em um único lugar.

## Próximas etapas (produção)

| Etapa | O que fazer | Onde |
|---|---|---|
| Banco + storage | Supabase (Postgres + Storage para fotos) implementando os contratos | `src/data/api/` |
| Autenticação | Supabase Auth ou Auth.js, proteção das rotas `/admin` no `proxy.ts` | `src/features/auth/` |
| Pedido no servidor | Mover `placeOrder` para Server Action / rota `/api/orders` (recalcular preços no servidor) | `src/features/orders/` |
| WhatsApp | WhatsApp Business Cloud API (Meta) ou provedor (Z-API, Twilio) implementando `NotificationGateway` | `src/features/notifications/` |
| Instagram | Instagram Graph API (conta Business/Creator) implementando `InstagramFeedProvider`, com cache | `src/data/` |
| Domínio + deploy | Registro `.com.br` (Registro.br) e deploy (Vercel) | — |
| Opcional | Pagamento online (Pix/cartão), cupons, notificações push do painel, relatórios | — |

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 4 · Zod · date-fns · lucide-react.
Fotos de demonstração: Unsplash (uso livre) — substituir pelas fotos reais pelo painel.
