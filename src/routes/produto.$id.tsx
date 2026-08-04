import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, Instagram, ShieldCheck, ShoppingBag, Truck } from "lucide-react";

import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductCard } from "@/components/ProductCard";

import { SiteShell } from "@/components/SiteShell";
import { catalogQueryOptions } from "@/lib/catalog-query";
import {
  discountPercent,
  finalPrice,
  formatBRL,
  productMessage,
  whatsappLink,
} from "@/lib/catalog";

export const Route = createFileRoute("/produto/$id")({
  loader: async ({ context, params }) => {
    const catalog = await context.queryClient.ensureQueryData(catalogQueryOptions);
    const product = catalog.products.find((p) => p.id === params.id);
    if (!product) throw notFound();
    return { name: product.name, description: product.description, brand: product.brand };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Produto indisponível — Rita Makes" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.name} — Rita Makes`;
    const description = `${loaderData.description} Disponível na Rita Makes, em Alto do Rodrigues — RN.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center px-4 text-center">
      <div>
        <h1 className="font-display text-4xl text-wine">Produto não encontrado</h1>
        <Link
          to="/produtos"
          search={{ q: undefined, cat: undefined }}
          className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground"
        >
          Ver catálogo
        </Link>
      </div>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useParams();
  const { data } = useSuspenseQuery(catalogQueryOptions);
  const { products, categories, settings } = data;
  const product = products.find((p) => p.id === id);

  if (!product) return null;

  const category = categories.find((c) => c.id === product.category_id);
  const related = products
    .filter((p) => p.category_id === product.category_id && p.id !== product.id)
    .slice(0, 4);
  const discount = discountPercent(product);

  return (
    <SiteShell settings={settings}>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <Link
          to="/produtos"
          search={{ q: undefined, cat: category?.slug }}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-primary"
        >
          <ArrowLeft className="size-4" /> Voltar para {category?.name ?? "o catálogo"}
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-secondary/40 shadow-soft">
            <img
              src={product.image_url}
              alt={product.name}
              width={1024}
              height={1024}
              className="aspect-square w-full object-cover"
            />
            {discount > 0 && (
              <span className="absolute left-5 top-5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
                -{discount}% OFF
              </span>
            )}
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary">{product.brand}</p>
            <h1 className="mt-3 font-display text-4xl leading-tight text-wine sm:text-5xl">{product.name}</h1>

            <div className="mt-6 flex items-end gap-3">
              <span className="font-display text-4xl text-wine">{formatBRL(finalPrice(product))}</span>
              {product.sale_price && (
                <span className="pb-1 text-lg text-muted-foreground line-through">
                  {formatBRL(product.price)}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              ou 3x de {formatBRL(finalPrice(product) / 3)} — combine no WhatsApp
            </p>

            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

            <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-xs font-medium">
              <span
                className={`size-2 rounded-full ${product.stock > 0 ? "bg-primary" : "bg-destructive"}`}
              />
              {product.stock > 0 ? `${product.stock} em estoque` : "Sob encomenda"}
            </p>

            <div className="mt-8 space-y-3">
              <AddToCartButton product={product} size="lg" />
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href={whatsappLink(settings.whatsapp, productMessage(product, settings.store_name))}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-primary px-6 py-4 text-sm font-medium text-primary transition hover:bg-secondary"
                >
                  <ShoppingBag className="size-4" /> Comprar pelo WhatsApp
                </a>
                <a
                  href={`https://instagram.com/${settings.instagram}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-4 text-sm font-medium text-primary transition hover:bg-secondary"
                >
                  <Instagram className="size-4" /> Instagram
                </a>
              </div>
            </div>


            <ul className="mt-8 grid gap-3 text-sm text-muted-foreground">
              {[
                { icon: ShieldCheck, text: "Produto original e lacrado" },
                { icon: Truck, text: "Entrega em Alto do Rodrigues e região" },
                { icon: Check, text: "Atendimento pessoal para tirar dúvidas de tom" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <Icon className="size-4 text-primary" /> {text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-3xl text-wine">Você também vai amar</h2>
            <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} settings={settings} />
              ))}
            </div>
          </section>
        )}
      </div>
    </SiteShell>
  );
}
