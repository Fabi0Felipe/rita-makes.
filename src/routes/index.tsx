import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, Search, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { useMemo, useState } from "react";

import { CategoryPill } from "@/components/CategoryPill";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { SiteShell } from "@/components/SiteShell";
import { catalogQueryOptions } from "@/lib/catalog-query";
import { discountPercent, isNew } from "@/lib/catalog";

export const Route = createFileRoute("/")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(catalogQueryOptions);
  },
  head: () => {
    const title = "Rita Makes — Loja de Maquiagem em Alto do Rodrigues, RN";
    const description =
      "Batons, bases, paletas, skincare e acessórios com curadoria premium. Compre pelo WhatsApp com atendimento próximo em Alto do Rodrigues — RN.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: HomePage,
});

function HomePage() {
  const { data } = useSuspenseQuery(catalogQueryOptions);
  const { categories, products, settings } = data;
  const [term, setTerm] = useState("");
  const navigate = useNavigate();

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of products) if (p.category_id) map.set(p.category_id, (map.get(p.category_id) ?? 0) + 1);
    return map;
  }, [products]);

  const featured = useMemo(
    () => [...products].sort((a, b) => b.sales_count - a.sales_count).slice(0, 8),
    [products],
  );
  const news = useMemo(() => products.filter(isNew).slice(0, 4), [products]);
  const deals = useMemo(
    () =>
      [...products]
        .filter((p) => discountPercent(p) > 0)
        .sort((a, b) => discountPercent(b) - discountPercent(a))
        .slice(0, 4),
    [products],
  );

  return (
    <SiteShell settings={settings}>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-rose opacity-40" />
        <div className="absolute -right-24 -top-24 -z-10 size-96 rounded-full bg-accent/50 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-background/70 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-primary">
              <Sparkles className="size-3.5" /> Alto do Rodrigues — RN
            </span>
            <h1 className="mt-6 font-display text-5xl leading-[1.05] text-wine sm:text-6xl lg:text-7xl">
              A beleza que combina <span className="italic text-primary">com você</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">
              Maquiagens, skincare e acessórios selecionados com carinho. Escolha aqui e finalize sua
              compra direto no WhatsApp, com atendimento pessoal da Rita.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                navigate({ to: "/produtos", search: { q: term || undefined, cat: undefined } });
              }}
              className="mt-8 flex max-w-md items-center gap-2 rounded-full border border-border bg-background p-1.5 shadow-soft"
            >
              <Search className="ml-3 size-4 shrink-0 text-muted-foreground" />
              <input
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Busque por batom, base, paleta..."
                aria-label="Buscar produtos"
                className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none"
              />
              <button
                type="submit"
                className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                Buscar
              </button>
            </form>

            <div className="mt-10 grid max-w-md grid-cols-3 gap-4 text-center">
              {[
                { icon: Truck, label: "Entrega local" },
                { icon: ShieldCheck, label: "100% originais" },
                { icon: Sparkles, label: "Curadoria Rita" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="rounded-2xl border border-border bg-background/70 p-3">
                  <Icon className="mx-auto size-5 text-primary" />
                  <p className="mt-2 text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-fade">
            <div className="overflow-hidden rounded-[2.5rem] border border-border shadow-lift">
              <img
                src="/images/hero-makeup.jpg"
                alt="Composição de produtos de maquiagem da Rita Makes"
                width={1024}
                height={1024}
                className="size-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden rounded-3xl border border-border bg-background/90 p-5 shadow-lift backdrop-blur sm:block">
              <p className="font-display text-3xl text-wine">{products.length}+</p>
              <p className="text-xs text-muted-foreground">produtos disponíveis</p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <Reveal>
          <SectionTitle
            eyebrow="Categorias"
            title="Encontre o seu ritual"
            subtitle="Do preparo da pele ao toque final, tudo organizado para facilitar sua escolha."
          />
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
          {categories.map((c, i) => (
            <Reveal key={c.id} delay={i * 40}>
              <CategoryPill category={c} count={counts.get(c.id) ?? 0} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* MAIS VENDIDOS */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <Reveal>
          <SectionTitle eyebrow="Favoritos" title="Os mais vendidos" subtitle="O que as clientes não param de pedir." />
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {featured.map((p, i) => (
            <Reveal key={p.id} delay={i * 50}>
              <ProductCard product={p} settings={settings} />
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            to="/produtos"
            search={{ q: undefined, cat: undefined }}
            className="inline-flex items-center gap-2 rounded-full border border-primary px-6 py-3 text-sm font-medium text-primary transition hover:bg-primary hover:text-primary-foreground"
          >
            Ver todos os produtos <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* PROMOÇÕES */}
      {deals.length > 0 && (
        <section className="mt-10 bg-secondary/50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <Reveal>
              <SectionTitle eyebrow="Promoções" title="Ofertas da semana" subtitle="Preços especiais por tempo limitado." />
            </Reveal>
            <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
              {deals.map((p, i) => (
                <Reveal key={p.id} delay={i * 50}>
                  <ProductCard product={p} settings={settings} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* NOVIDADES */}
      {news.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <Reveal>
            <SectionTitle eyebrow="Novidades" title="Acabou de chegar" subtitle="Lançamentos fresquinhos na vitrine." />
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {news.map((p, i) => (
              <Reveal key={p.id} delay={i * 50}>
                <ProductCard product={p} settings={settings} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* SOBRE */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <Reveal>
          <div className="grid items-center gap-10 overflow-hidden rounded-[2.5rem] border border-border bg-gradient-rose/40 p-8 shadow-soft md:grid-cols-2 md:p-12">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary">Sobre a Rita Makes</p>
              <h2 className="mt-4 font-display text-4xl leading-tight text-wine">
                Beleza com cuidado, perto de você
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                A Rita Makes nasceu do desejo de aproximar produtos de qualidade das mulheres de Alto do
                Rodrigues. Cada item é escolhido a dedo, testado e indicado com honestidade — porque
                autoestima também se constrói com confiança no que você usa.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                {[
                  ["+500", "clientes atendidas"],
                  [`${products.length}`, "produtos no catálogo"],
                  ["100%", "originais"],
                ].map(([n, l]) => (
                  <div key={l} className="rounded-2xl bg-background/70 p-4">
                    <p className="font-display text-2xl text-wine">{n}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">{l}</p>
                  </div>
                ))}
              </div>
            </div>
            <img
              src="/images/cat-acessorios.jpg"
              alt="Pincéis de maquiagem em tons rosé"
              loading="lazy"
              width={1024}
              height={1024}
              className="rounded-[2rem] object-cover shadow-lift"
            />
          </div>
        </Reveal>
      </section>
    </SiteShell>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
      <h2 className="mt-3 font-display text-4xl leading-tight text-wine sm:text-5xl">{title}</h2>
      {subtitle && <p className="mt-3 text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
