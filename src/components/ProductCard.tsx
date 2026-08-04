import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";

import { AddToCartButton } from "./AddToCartButton";


import {
  discountPercent,
  finalPrice,
  formatBRL,
  isNew,
  productMessage,
  whatsappLink,
  type Product,
  type StoreSettings,
} from "@/lib/catalog";

export function ProductCard({
  product,
  settings,
}: {
  product: Product;
  settings: StoreSettings;
}) {
  const discount = discountPercent(product);

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition duration-500 hover:-translate-y-1.5 hover:shadow-lift">
      <Link
        to="/produto/$id"
        params={{ id: product.id }}
        className="relative block aspect-square overflow-hidden bg-secondary/50"
      >
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          width={1024}
          height={1024}
          className="size-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground">
              -{discount}%
            </span>
          )}
          {isNew(product) && (
            <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-accent-foreground">
              Novidade
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{product.brand}</p>
        <Link
          to="/produto/$id"
          params={{ id: product.id }}
          className="mt-1 line-clamp-2 font-medium leading-snug text-foreground transition hover:text-primary"
        >
          {product.name}
        </Link>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-display text-xl text-wine">{formatBRL(finalPrice(product))}</span>
          {product.sale_price && (
            <span className="text-sm text-muted-foreground line-through">{formatBRL(product.price)}</span>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <AddToCartButton product={product} />
          <a
            href={whatsappLink(settings.whatsapp, productMessage(product, settings.store_name))}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-primary px-4 py-2 text-xs font-medium text-primary transition hover:bg-secondary"
          >
            <ShoppingBag className="size-3.5" />
            Comprar pelo WhatsApp
          </a>
        </div>

      </div>
    </article>
  );
}
