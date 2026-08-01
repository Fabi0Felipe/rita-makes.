import { Link, useNavigate } from "@tanstack/react-router";
import { Instagram, Menu, Search, Sparkles, X } from "lucide-react";
import { useState } from "react";

const NAV = [
  { to: "/", label: "Início" },
  { to: "/produtos", label: "Produtos" },
  { to: "/novidades", label: "Novidades" },
  { to: "/promocoes", label: "Promoções" },
  { to: "/contato", label: "Contato" },
] as const;

export function Header({ instagram }: { instagram: string }) {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const navigate = useNavigate();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setOpen(false);
    navigate({ to: "/produtos", search: { q: term || undefined, cat: undefined } });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <span className="grid size-9 place-items-center rounded-full bg-gradient-rose">
            <Sparkles className="size-4 text-wine" />
          </span>
          <span className="font-display text-xl leading-none tracking-tight text-wine sm:text-2xl">
            Rita <span className="italic text-primary">Makes</span>
          </span>
        </Link>

        <nav className="ml-6 hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ className: "text-primary" }}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <form onSubmit={submit} className="ml-auto hidden max-w-xs flex-1 md:block">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Buscar produtos..."
              aria-label="Buscar produtos"
              className="w-full rounded-full border border-border bg-secondary/60 py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-primary focus:bg-background"
            />
          </div>
        </form>

        <a
          href={`https://instagram.com/${instagram}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram da Rita Makes"
          className="hidden size-10 place-items-center rounded-full border border-border text-primary transition hover:bg-secondary md:grid"
        >
          <Instagram className="size-4" />
        </a>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menu"
          className="ml-auto grid size-10 place-items-center rounded-full border border-border text-primary lg:hidden"
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background px-4 pb-5 pt-4 lg:hidden">
          <form onSubmit={submit} className="mb-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Buscar produtos..."
                aria-label="Buscar produtos"
                className="w-full rounded-full border border-border bg-secondary/60 py-2.5 pl-9 pr-4 text-sm outline-none focus:border-primary"
              />
            </div>
          </form>
          <div className="grid gap-1">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition hover:bg-secondary"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
