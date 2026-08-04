import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

import { useCart } from "@/lib/cart";

export function CartButton({ className = "" }: { className?: string }) {
  const { count, bump } = useCart();
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (!bump) return;
    setPulse(true);
    const t = window.setTimeout(() => setPulse(false), 450);
    return () => window.clearTimeout(t);
  }, [bump]);

  return (
    <Link
      to="/carrinho"
      aria-label={`Carrinho com ${count} ${count === 1 ? "item" : "itens"}`}
      className={`relative grid size-10 shrink-0 place-items-center rounded-full border border-border text-primary transition hover:bg-secondary ${
        pulse ? "scale-110" : "scale-100"
      } duration-300 ${className}`}
    >
      <ShoppingCart className="size-4" />
      {count > 0 && (
        <span
          className={`absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-primary px-1.5 text-[10px] font-semibold leading-5 text-primary-foreground transition duration-300 ${
            pulse ? "scale-125" : "scale-100"
          }`}
        >
          {count}
        </span>
      )}
    </Link>
  );
}
