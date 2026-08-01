import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

import { ProductCard } from "@/components/ProductCard";
import { SiteShell } from "@/components/SiteShell";
import { catalogQueryOptions } from "@/lib/catalog-query";
import { finalPrice } from "@/lib/catalog";

type ProductSearch = { q?: string | undefined; cat?: string | undefined };

export const Route = createFileRoute("/produtos")({
  validateSearch: (search: Record<string, unknown>): ProductSearch => ({
    q: typeof search["q"] === "string" && search["q"] ? search["q"] : undefined,
    cat: typeof search["cat"] === "string" && search["cat"] ? search["cat"] : undefined,
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(catalogQueryOptions);
  },
  head: () => {
    const title = "Produtos — Rita Makes | Maquiagem e Skincare";
    const description =
      "Catálogo completo da Rita Makes: batons, bases, corretivos, paletas, skincare, pincéis e kits. Filtre por categoria e compre pelo WhatsApp.";
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
  component: ProductsPage,
});

const SORTS = [
  { id: "relevance", label: "Mais vendidos" },
  { id: "new", label: "Novidades" },
  { id: "price-asc", label: "Menor preço" },
  { id: "price-desc", label: "Maior preço" },
  { id: "name", label: "A-Z" },
] as const;

function ProductsPage() {
  const { q, cat } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const { data } = useSuspenseQuery(catalogQueryOptions);
  const { products, categories, settings } = data;
  const [sort, setSort] = useState<(typeof SORTS)[number]["id"]>("relevance");
  const [term, setTerm] = useState(q ?? "");

  const category = categories.find((c) => c.slug === cat);

  const list = useMemo(() => {
    const search = (q ?? "").toLowerCase().trim();
    let items = products.filter((p) => {
      const matchCat = !category || p.category_id === category.id;
      const matchTerm =
        !search ||
        p.name.toLowerCase().includes(search) ||
        p.brand.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search);
      return matchCat && matchTerm;
    });

    items = [...items];
    if (sort === "price-asc") items.sort((a, b) => finalPrice(a) - finalPrice(b));
    if (sort === "price-desc") items.sort((a, b) => finalPrice(b) - finalPrice(a));
    if (sort === "name") items.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
    if (sort === "new") items.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
    if (sort === "relevance") items.sort((a, b) => b.sales_count - a.sales_count);
    return items;
  }, [products, category, q, sort]);

  function applySearch(e: React.FormEvent) {
    e.preventDefault();
    navigate({ search: { q: term || undefined, cat } });
  }

  return (
    <SiteShell settings={settings}>
      <section className="border-b border-border bg-gradient-rose/50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-primary">Catálogo</p>
          <h1 className="mt-3 font-display text-5xl text-wine">
            {category ? category.name : "Todos os produtos"}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {list.length} {list.length === 1 ? "produto encontrado" : "produtos encontrados"}
            {q ? ` para “${q}”` : ""}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <form onSubmit={applySearch} className="mb-6 flex flex-wrap items-center gap-3">
          <div className="relative min-w-56 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Buscar no catálogo..."
              aria-label="Buscar no catálogo"
              className="w-full rounded-full border border-border bg-secondary/50 py-3 pl-10 pr-4 text-sm outline-none focus:border-primary focus:bg-background"
            />
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5">
            <SlidersHorizontal className="size-4 text-primary" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              aria-label="Ordenar produtos"
              className="bg-transparent text-sm outline-none"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </form>

        <div className="mb-8 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => navigate({ search: { q, cat: undefined } })}
            className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
              !cat ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"
            }`}
          >
            Todas
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => navigate({ search: { q, cat: c.slug } })}
              className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                cat === c.slug
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:border-primary"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-border py-20 text-center text-sm text-muted-foreground">
            Nenhum produto encontrado. Tente outra busca ou categoria.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {list.map((p) => (
              <ProductCard key={p.id} product={p} settings={settings} />
            ))}
          </div>
        )}
      </div>
    </SiteShell>
  );
}
