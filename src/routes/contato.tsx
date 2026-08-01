import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Clock, Instagram, MapPin, MessageCircle } from "lucide-react";

import { SiteShell } from "@/components/SiteShell";
import { Reveal } from "@/components/Reveal";
import { catalogQueryOptions } from "@/lib/catalog-query";
import { whatsappLink } from "@/lib/catalog";

const FAQ = [
  {
    q: "Como faço para comprar?",
    a: "Escolha o produto no catálogo e clique em “Comprar pelo WhatsApp”. A mensagem já vai preenchida com o item e o valor — é só enviar e combinar o pagamento.",
  },
  {
    q: "Vocês entregam?",
    a: "Sim! Fazemos entregas em Alto do Rodrigues e região. Combine o frete e o prazo direto no WhatsApp.",
  },
  {
    q: "Os produtos são originais?",
    a: "Todos os itens são 100% originais e lacrados, comprados de distribuidores autorizados.",
  },
  {
    q: "Não sei qual tom escolher, vocês ajudam?",
    a: "Claro. Mande uma foto com luz natural no WhatsApp que indicamos o tom mais próximo do seu subtom de pele.",
  },
  {
    q: "Quais formas de pagamento vocês aceitam?",
    a: "Pix, dinheiro e cartão. Parcelamentos podem ser combinados no atendimento.",
  },
];

export const Route = createFileRoute("/contato")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(catalogQueryOptions);
  },
  head: () => {
    const title = "Contato — Rita Makes | Alto do Rodrigues, RN";
    const description =
      "Fale com a Rita Makes pelo WhatsApp ou Instagram. Horários de atendimento, localização em Alto do Rodrigues — RN e perguntas frequentes.";
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
  component: ContactPage,
});

function ContactPage() {
  const { data } = useSuspenseQuery(catalogQueryOptions);
  const s = data.settings;

  return (
    <SiteShell settings={s}>
      <section className="border-b border-border bg-gradient-rose/50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-primary">Contato</p>
          <h1 className="mt-3 font-display text-5xl text-wine">Vamos conversar?</h1>
          <p className="mt-3 max-w-lg text-sm text-muted-foreground">
            Atendimento próximo e sem robô. Chame no WhatsApp que a Rita responde pessoalmente.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-3">
        {[
          {
            icon: MessageCircle,
            title: "WhatsApp",
            body: "Tire dúvidas, peça indicação de tom e finalize sua compra.",
            action: {
              label: "Abrir conversa",
              href: whatsappLink(s.whatsapp, "Olá, Rita Makes! Vim pelo site."),
            },
          },
          {
            icon: Instagram,
            title: "Instagram",
            body: "Novidades, swatches e dicas de maquiagem todos os dias.",
            action: { label: `@${s.instagram}`, href: `https://instagram.com/${s.instagram}` },
          },
          {
            icon: MapPin,
            title: "Localização",
            body: s.address,
            action: {
              label: "Ver no mapa",
              href: `https://www.google.com/maps/search/${encodeURIComponent(s.address)}`,
            },
          },
        ].map(({ icon: Icon, title, body, action }, i) => (
          <Reveal key={title} delay={i * 80}>
            <div className="h-full rounded-3xl border border-border bg-card p-7 shadow-soft">
              <span className="grid size-12 place-items-center rounded-full bg-gradient-rose">
                <Icon className="size-5 text-wine" />
              </span>
              <h2 className="mt-5 font-display text-2xl text-wine">{title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
              <a
                href={action.href}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex rounded-full border border-primary px-5 py-2.5 text-sm font-medium text-primary transition hover:bg-primary hover:text-primary-foreground"
              >
                {action.label}
              </a>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
        <Reveal>
          <div className="flex items-center gap-3 rounded-3xl border border-border bg-secondary/50 p-6">
            <Clock className="size-5 shrink-0 text-primary" />
            <p className="text-sm text-foreground">
              <span className="font-medium">Horários:</span> {s.opening_hours}
            </p>
          </div>
        </Reveal>
      </div>

      <section className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
        <h2 className="font-display text-4xl text-wine">Perguntas frequentes</h2>
        <div className="mt-8 grid gap-3">
          {FAQ.map((item, i) => (
            <Reveal key={item.q} delay={i * 50}>
              <details className="group rounded-2xl border border-border bg-card p-5 transition hover:border-primary/40">
                <summary className="cursor-pointer list-none text-sm font-medium text-foreground marker:hidden">
                  {item.q}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <iframe
          title="Mapa da localização da Rita Makes"
          src={`https://www.google.com/maps?q=${encodeURIComponent(s.address)}&output=embed`}
          loading="lazy"
          className="h-80 w-full rounded-3xl border border-border shadow-soft"
        />
      </div>
    </SiteShell>
  );
}
