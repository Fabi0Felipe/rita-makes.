import { Link } from "@tanstack/react-router";
import {
  Brush,
  CircleDot,
  Droplet,
  Eye,
  Flower2,
  Gift,
  Leaf,
  Palette,
  Pencil,
  PenLine,
  Sparkles,
  Sun,
  Triangle,
  Wand2,
} from "lucide-react";

import type { Category } from "@/lib/catalog";

const ICONS: Record<string, typeof Sparkles> = {
  lipstick: Sparkles,
  droplet: Droplet,
  "wand-2": Wand2,
  "circle-dot": CircleDot,
  "flower-2": Flower2,
  sun: Sun,
  triangle: Triangle,
  palette: Palette,
  "pen-line": PenLine,
  eye: Eye,
  pencil: Pencil,
  leaf: Leaf,
  brush: Brush,
  gift: Gift,
};

export function CategoryPill({ category, count }: { category: Category; count: number }) {
  const Icon = ICONS[category.icon] ?? Sparkles;
  return (
    <Link
      to="/produtos"
      search={{ cat: category.slug, q: undefined }}
      className="group flex flex-col items-center gap-3 rounded-3xl border border-border bg-card p-5 text-center shadow-soft transition duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lift"
    >
      <span className="grid size-14 place-items-center rounded-full bg-gradient-rose transition group-hover:scale-110">
        <Icon className="size-6 text-wine" />
      </span>
      <span className="text-sm font-medium leading-tight text-foreground">{category.name}</span>
      <span className="text-xs text-muted-foreground">{count} itens</span>
    </Link>
  );
}
