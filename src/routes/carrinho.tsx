import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { SiteShell } from "@/components/SiteShell";
import { useCart } from "@/lib/cart";
import { cartTotals, lineTotal, orderMessage, type CartItem } from "@/lib/cart-message";
import { catalogQueryOptions } from "@/lib/catalog-query";
import { finalPrice, formatBRL, whatsappLink } from "@/lib/catalog";

export const Route = createFileRoute("/carrinho")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(catalogQueryOptions);
  },
  head: () => {
    const title = "Carrinho — Rita Makes";
    const description =
      "Revise os produtos escolhidos, informe seus dados e finalize seu pedido da Rita Makes pelo WhatsApp.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "robots", content: "noindex" },
      ],
    };
  },
  errorComponent: () => (
    <div className="grid min-h-screen place-items-center px-4 text-center text-sm text-muted-foreground">
      Não foi possível carregar o carrinho. Atualize a página.
    </div>
  ),
  notFoundComponent: () => null,
  component: CartPage,
});

function CartPage() {
  const { data } = useSuspenseQuery(catalogQueryOptions);
  const { products, settings } = data;
  const { lines, hydrated, setQty, remove, clear, customer, setCustomer } = useCart();
  const [touched, setTouched] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);

  const items = useMemo<CartItem[]>(
    () =>
      lines
        .map((l) => {
          const product = products.find((p) => p.id === l.id);
          return product ? { product, qty: l.qty } : null;
        })
        .filter((i): i is CartItem => i !== null),
    [lines, products],
  );

  const { totalItems, subtotal, total } = cartTotals(items);
  const nameError = !customer.name.trim();
  const addressError = !customer.address.trim();

  function drop(id: string) {
    setRemoving(id);
    window.setTimeout(() => {
      remove(id);
      setRemoving(null);
    }, 220);
  }

  function checkout() {
    setTouched(true);
    if (nameError || addressError) {
      toast.error("Preencha nome e endereço para continuar");
      return;
    }
    if (items.length === 0) return;
    window.open(whatsappLink(settings.whatsapp, orderMessage(items, customer)), "_blank");
  }

  return (
    <SiteShell settings={settings}>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <h1 className="font-display text-4xl text-wine sm:text-5xl">Seu carrinho</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {hydrated
            ? `${totalItems} ${totalItems === 1 ? "item" : "itens"} selecionados`
            : "Carregando seus itens..."}
        </p>

        {hydrated && items.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-dashed border-border py-20 text-center">
            <ShoppingCart className="mx-auto size-8 text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">Seu carrinho está vazio.</p>
            <Link
              to="/produtos"
              search={{ q: undefined, cat: undefined }}
              className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              Ver catálogo
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="space-y-4">
              {items.map(({ product, qty }) => (
                <article
                  key={product.id}
                  className={`flex gap-4 rounded-3xl border border-border bg-card p-4 shadow-soft transition duration-300 ${
                    removing === product.id ? "translate-x-3 scale-95 opacity-0" : "opacity-100"
                  }`}
                >
                  <Link
                    to="/produto/$id"
                    params={{ id: product.id }}
                    className="size-24 shrink-0 overflow-hidden rounded-2xl bg-secondary/50 sm:size-28"
                  >
                    <img
                      src={product.image_url}
                      alt={product.name}
                      loading="lazy"
                      className="size-full object-cover"
                    />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                      {product.brand}
                    </p>
                    <Link
                      to="/produto/$id"
                      params={{ id: product.id }}
                      className="line-clamp-2 font-medium leading-snug text-foreground transition hover:text-primary"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatBRL(finalPrice(product))} / un.
                    </p>

                    <div className="mt-auto flex flex-wrap items-center gap-3 pt-3">
                      <div className="flex items-center gap-1 rounded-full border border-border">
                        <button
                          type="button"
                          onClick={() => setQty(product.id, qty - 1)}
                          aria-label={`Diminuir quantidade de ${product.name}`}
                          className="grid size-8 place-items-center rounded-full text-primary transition hover:bg-secondary active:scale-90"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="min-w-6 text-center text-sm font-medium">{qty}</span>
                        <button
                          type="button"
                          onClick={() => setQty(product.id, qty + 1)}
                          aria-label={`Aumentar quantidade de ${product.name}`}
                          className="grid size-8 place-items-center rounded-full text-primary transition hover:bg-secondary active:scale-90"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>

                      <span className="font-display text-lg text-wine">
                        {formatBRL(lineTotal({ product, qty }))}
                      </span>

                      <button
                        type="button"
                        onClick={() => drop(product.id)}
                        aria-label={`Remover ${product.name}`}
                        className="ml-auto grid size-8 place-items-center rounded-full text-muted-foreground transition hover:bg-secondary hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}

              {items.length > 0 && (
                <button
                  type="button"
                  onClick={clear}
                  className="text-xs text-muted-foreground underline-offset-4 transition hover:text-destructive hover:underline"
                >
                  Esvaziar carrinho
                </button>
              )}
            </div>

            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
                <h2 className="font-display text-2xl text-wine">Resumo do pedido</h2>
                <dl className="mt-5 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Itens</dt>
                    <dd className="font-medium">{totalItems}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Produtos</dt>
                    <dd className="font-medium">{formatBRL(subtotal)}</dd>
                  </div>
                  <div className="flex items-baseline justify-between border-t border-border pt-3">
                    <dt className="font-medium">Total</dt>
                    <dd className="font-display text-2xl text-wine">{formatBRL(total)}</dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
                <h2 className="font-display text-2xl text-wine">Seus dados</h2>
                <div className="mt-5 space-y-3">
                  <Field
                    label="Nome completo *"
                    value={customer.name}
                    onChange={(v) => setCustomer({ name: v })}
                    error={touched && nameError ? "Informe seu nome" : ""}
                  />
                  <Field
                    label="Endereço completo *"
                    value={customer.address}
                    onChange={(v) => setCustomer({ address: v })}
                    error={touched && addressError ? "Informe seu endereço" : ""}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Field
                      label="Bairro"
                      value={customer.district}
                      onChange={(v) => setCustomer({ district: v })}
                    />
                    <Field
                      label="Número"
                      value={customer.number}
                      onChange={(v) => setCustomer({ number: v })}
                    />
                  </div>
                  <Field
                    label="Complemento"
                    value={customer.complement}
                    onChange={(v) => setCustomer({ complement: v })}
                  />
                  <Field
                    label="Referência"
                    value={customer.reference}
                    onChange={(v) => setCustomer({ reference: v })}
                  />
                  <Field
                    label="Telefone"
                    value={customer.phone}
                    onChange={(v) => setCustomer({ phone: v })}
                  />
                </div>

                <button
                  type="button"
                  onClick={checkout}
                  className="mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-[#25D366] px-6 py-4 text-sm font-semibold text-white shadow-lift transition hover:brightness-105 active:scale-[0.98]"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-5" aria-hidden="true">
                    <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.48-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.46s1.07 2.86 1.22 3.06c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.71 2-1.4.25-.7.25-1.28.17-1.4-.07-.13-.27-.2-.57-.35M12.05 21.5h-.02a9.4 9.4 0 0 1-4.79-1.31l-.34-.2-3.56.93.95-3.47-.22-.36a9.38 9.38 0 0 1-1.44-5A9.45 9.45 0 0 1 18.75 5.3a9.38 9.38 0 0 1 2.77 6.68 9.45 9.45 0 0 1-9.47 9.52M20.52 3.49A11.8 11.8 0 0 0 12.05 0C5.5 0 .18 5.32.17 11.86c0 2.09.55 4.13 1.6 5.93L.07 24l6.35-1.66a11.9 11.9 0 0 0 5.62 1.43h.01c6.55 0 11.87-5.32 11.88-11.86a11.8 11.8 0 0 0-3.48-8.42" />
                  </svg>
                  Finalizar Pedido pelo WhatsApp
                </button>
                <p className="mt-3 text-center text-[11px] text-muted-foreground">
                  Você será levado ao WhatsApp com o pedido já preenchido.
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </SiteShell>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1 w-full rounded-2xl border bg-secondary/40 px-4 py-2.5 text-sm outline-none transition focus:bg-background ${
          error ? "border-destructive" : "border-border focus:border-primary"
        }`}
      />
      {error && <span className="mt-1 block text-[11px] text-destructive">{error}</span>}
    </label>
  );
}
