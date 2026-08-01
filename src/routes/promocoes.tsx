import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { SiteShell } from "@/components/SiteShell";
import { catalogQueryOptions } from "@/lib/catalog-query";
import { discountPercent } from "@/lib/catalog";

export const Route = createFileRoute("/promocoes")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(catalogQueryOptions);
  },
  head: () => {
    const title = "Promoções — Rita Makes | Maquiagem com desconto";
    const description =
      "Ofertas da semana na Rita Makes: batons, bases, paletas e skincare com desconto real. Aproveite enquanto durar o estoque.";
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
  component: PromosPage,
});

function PromosPage() {
  const { data } = useSuspenseQuery(catalogQueryOptions);
  const deals = data.products
    .filter((p) => discountPercent(p) > 0)
    .sort((a, b) => discountPercent(b) - discountPercent(a));

  return (
    <SiteShell settings={data.settings}>
      <section className="border-b border-border bg-gradient-rose/50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-primary">Ofertas</p>
          <h1 className="mt-3 font-display text-5xl text-wine">Promoções da semana</h1>
          <p className="mt-3 max-w-lg text-sm text-muted-foreground">
            Descontos reais em produtos selecionados. Quantidades limitadas — garanta o seu pelo WhatsApp.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {deals.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-border py-20 text-center text-sm text-muted-foreground">
            Nenhuma promoção ativa no momento. Volte em breve!
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {deals.map((p, i) => (
              <Reveal key={p.id} delay={i * 40}>
                <ProductCard product={p} settings={data.settings} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </SiteShell>
  );
}
