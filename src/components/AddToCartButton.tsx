import { ShoppingBag, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/catalog";

export function AddToCartButton({
  product,
  size = "sm",
}: {
  product: Product;
  size?: "sm" | "lg";
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  const base =
    size === "lg"
      ? "px-6 py-4 text-sm gap-2"
      : "px-4 py-2.5 text-sm gap-2";

  if (product.stock <= 0) {
    return (
      <button
        type="button"
        disabled
        className={`inline-flex w-full items-center justify-center rounded-full border border-border bg-muted ${base} font-medium text-muted-foreground`}
      >
        Produto Indisponível
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        add(product.id);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1200);
        toast.success("Produto adicionado ao carrinho", { description: product.name });
      }}
      className={`inline-flex w-full items-center justify-center rounded-full bg-primary ${base} font-medium text-primary-foreground transition duration-300 hover:opacity-90 active:scale-95 ${
        added ? "scale-[1.03]" : ""
      }`}
    >
      {added ? <Check className="size-4" /> : <ShoppingBag className="size-4" />}
      {added ? "Adicionado!" : "Adicionar ao Carrinho"}
    </button>
  );
}
