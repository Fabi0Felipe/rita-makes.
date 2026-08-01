import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { SiteShell } from "@/components/SiteShell";
import { catalogQueryOptions } from "@/lib/catalog-query";

export const Route = createFileRoute("/novidades")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(catalogQueryOptions);
  },
  head: () => {
    const title = "Novidades — Rita Makes | Lançamentos de maquiagem";
    const description =
      "Os lançamentos mais recentes da Rita Makes. Confira o que acabou de chegar na vitrine e garanta antes de esgotar.";
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
  component: NewsPage,
});

function NewsPage() {
  const { data } = useSuspenseQuery(catalogQueryOptions);
  const items = [...data.products]
    .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
    .slice(0, 16);

  return (
    <SiteShell settings={data.settings}>
      <section className="border-b border-border bg-gradient-rose/50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-primary">Lançamentos</p>
          <h1 className="mt-3 font-display text-5xl text-wine">Novidades na vitrine</h1>
          <p className="mt-3 max-w-lg text-sm text-muted-foreground">
            Selecionamos as chegadas mais recentes para você conhecer antes de todo mundo.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {items.map((p, i) => (
            <Reveal key={p.id} delay={i * 40}>
              <ProductCard product={p} settings={data.settings} />
            </Reveal>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
