import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Acesso administrativo — Rita Makes" },
      { name: "description", content: "Área restrita da equipe Rita Makes para gerenciar o catálogo." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Acesso administrativo — Rita Makes" },
      { property: "og:description", content: "Área restrita da equipe Rita Makes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Conta criada! Confirme o e-mail para entrar.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin", replace: true });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível entrar.");
    } finally {
      setLoading(false);
    }
  }

  async function google() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Não foi possível entrar com o Google.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/admin", replace: true });
  }

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-rose/40 px-4 py-16">
      <div className="w-full max-w-md rounded-[2rem] border border-border bg-card p-8 shadow-lift">
        <Link to="/" className="flex items-center justify-center gap-2">
          <span className="grid size-9 place-items-center rounded-full bg-gradient-rose">
            <Sparkles className="size-4 text-wine" />
          </span>
          <span className="font-display text-2xl text-wine">
            Rita <span className="italic text-primary">Makes</span>
          </span>
        </Link>

        <h1 className="mt-6 text-center font-display text-3xl text-wine">
          {mode === "login" ? "Entrar no painel" : "Criar conta"}
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Área restrita para gerenciar produtos e categorias.
        </p>

        <form onSubmit={submit} className="mt-8 grid gap-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail"
            aria-label="E-mail"
            className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            aria-label="Senha"
            className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> ou <span className="h-px flex-1 bg-border" />
        </div>

        <button
          type="button"
          onClick={google}
          className="w-full rounded-xl border border-border py-3 text-sm font-medium transition hover:bg-secondary"
        >
          Continuar com Google
        </button>

        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="mt-6 w-full text-center text-xs text-muted-foreground transition hover:text-primary"
        >
          {mode === "login" ? "Não tem conta? Criar agora" : "Já tenho conta — entrar"}
        </button>
      </div>
    </div>
  );
}
