import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { catalogQueryOptions } from "@/lib/catalog-query";
import { formatBRL, type Product } from "@/lib/catalog";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Painel administrativo — Rita Makes" },
      { name: "description", content: "Gerencie produtos, categorias e dados da loja Rita Makes." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Painel administrativo — Rita Makes" },
      { property: "og:description", content: "Área restrita da equipe Rita Makes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

const EMPTY = {
  name: "",
  brand: "",
  category_id: "",
  description: "",
  price: "",
  sale_price: "",
  image_url: "/images/cat-batons.jpg",
  stock: "0",
  is_featured: false,
};

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: catalog } = useQuery(catalogQueryOptions);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return setIsAdmin(false);
      const { data: ok } = await supabase.rpc("has_role", { _user_id: data.user.id, _role: "admin" });
      setIsAdmin(Boolean(ok));
    });
  }, []);

  const products = useMemo(() => {
    const list = catalog?.products ?? [];
    const term = search.toLowerCase().trim();
    return term ? list.filter((p) => p.name.toLowerCase().includes(term)) : list;
  }, [catalog, search]);

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  function startNew() {
    setEditing(null);
    setForm({ ...EMPTY, category_id: catalog?.categories[0]?.id ?? "" });
    setOpen(true);
  }

  function startEdit(p: Product) {
    setEditing(p);
    setForm({
      name: p.name,
      brand: p.brand,
      category_id: p.category_id ?? "",
      description: p.description,
      price: String(p.price),
      sale_price: p.sale_price === null ? "" : String(p.sale_price),
      image_url: p.image_url,
      stock: String(p.stock),
      is_featured: p.is_featured,
    });
    setOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      brand: form.brand.trim(),
      category_id: form.category_id || null,
      description: form.description.trim(),
      price: Number(form.price) || 0,
      sale_price: form.sale_price ? Number(form.sale_price) : null,
      image_url: form.image_url.trim(),
      stock: Number(form.stock) || 0,
      is_featured: form.is_featured,
    };
    const { error } = editing
      ? await supabase.from("products").update(payload).eq("id", editing.id)
      : await supabase.from("products").insert(payload);

    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(editing ? "Produto atualizado." : "Produto criado.");
    setOpen(false);
    queryClient.invalidateQueries({ queryKey: ["catalog"] });
  }

  async function remove(p: Product) {
    if (!confirm(`Excluir "${p.name}"?`)) return;
    const { error } = await supabase.from("products").delete().eq("id", p.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Produto excluído.");
    queryClient.invalidateQueries({ queryKey: ["catalog"] });
  }

  if (isAdmin === false) {
    return (
      <div className="grid min-h-screen place-items-center px-4 text-center">
        <div className="max-w-md">
          <h1 className="font-display text-4xl text-wine">Acesso restrito</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Sua conta ainda não tem permissão de administradora. Peça a liberação do acesso.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/" className="rounded-full border border-primary px-5 py-2.5 text-sm text-primary">
              Voltar ao site
            </Link>
            <button
              onClick={signOut}
              className="rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6">
          <Link to="/" className="font-display text-xl text-wine">
            Rita <span className="italic text-primary">Makes</span>
          </Link>
          <span className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">Painel</span>
          <button
            onClick={signOut}
            className="ml-auto inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm transition hover:bg-secondary"
          >
            <LogOut className="size-4" /> Sair
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl text-wine">Produtos</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {catalog?.products.length ?? 0} itens cadastrados
            </p>
          </div>
          <button
            onClick={startNew}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
          >
            <Plus className="size-4" /> Novo produto
          </button>
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar produto..."
          aria-label="Buscar produto"
          className="mt-6 w-full max-w-sm rounded-full border border-border bg-background px-5 py-3 text-sm outline-none focus:border-primary"
        />

        <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-background">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-4">Produto</th>
                <th className="hidden p-4 sm:table-cell">Preço</th>
                <th className="hidden p-4 md:table-cell">Estoque</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image_url}
                        alt=""
                        loading="lazy"
                        className="size-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden p-4 sm:table-cell">{formatBRL(p.sale_price ?? p.price)}</td>
                  <td className="hidden p-4 md:table-cell">{p.stock}</td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => startEdit(p)}
                        aria-label={`Editar ${p.name}`}
                        className="grid size-9 place-items-center rounded-full border border-border transition hover:bg-secondary"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        onClick={() => remove(p)}
                        aria-label={`Excluir ${p.name}`}
                        className="grid size-9 place-items-center rounded-full border border-border text-destructive transition hover:bg-secondary"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4">
          <form
            onSubmit={save}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-background p-6 shadow-lift"
          >
            <h2 className="font-display text-2xl text-wine">
              {editing ? "Editar produto" : "Novo produto"}
            </h2>
            <div className="mt-5 grid gap-3">
              {(
                [
                  ["name", "Nome", "text"],
                  ["brand", "Marca", "text"],
                  ["image_url", "URL da imagem", "text"],
                  ["price", "Preço", "number"],
                  ["sale_price", "Preço promocional (opcional)", "number"],
                  ["stock", "Estoque", "number"],
                ] as const
              ).map(([key, label, type]) => (
                <label key={key} className="grid gap-1 text-xs text-muted-foreground">
                  {label}
                  <input
                    type={type}
                    step="0.01"
                    required={key === "name" || key === "price"}
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                  />
                </label>
              ))}
              <label className="grid gap-1 text-xs text-muted-foreground">
                Categoria
                <select
                  value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                >
                  {(catalog?.categories ?? []).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1 text-xs text-muted-foreground">
                Descrição
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                />
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                />
                Produto em destaque
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-border px-5 py-2.5 text-sm"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
