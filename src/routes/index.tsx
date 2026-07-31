import { createFileRoute } from "@tanstack/react-router";
import {
  Phone,
  MapPin,
  Clock,
  Star,
  Utensils,
  Bike,
  ShoppingBag,
  MessageCircle,
  Navigation,
  Facebook,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import heroPizza from "@/assets/hero-pizza.jpg";
import parmegiana from "@/assets/parmegiana.jpg";
import pastel from "@/assets/pastel.jpg";
import ambiente from "@/assets/ambiente.jpg";

const NAME = "Pizzaria Cantinho do Céu";
const ADDRESS = "Av. Angelo Varela, 255 - Centro, Alto do Rodrigues - RN, 59507-000";
const PHONE_DISPLAY = "(84) 99989-4933";
const PHONE_TEL = "+5584999894933";
const WHATSAPP = "https://wa.me/5584999894933";
const MAPS_QUERY = encodeURIComponent(`${NAME}, ${ADDRESS}`);
const MAPS_ROUTE = `https://www.google.com/maps/dir/?api=1&destination=${MAPS_QUERY}`;
const MAPS_EMBED = `https://www.google.com/maps?q=${MAPS_QUERY}&output=embed`;

const services = [
  { icon: Utensils, title: "Refeição no local", text: "Salão para comer no capricho, ali no Centro." },
  { icon: ShoppingBag, title: "Retirada na porta", text: "Peça e retire sem sair do carro." },
  { icon: Bike, title: "Entrega sem contato", text: "Seu pedido entregue com segurança." },
  { icon: MessageCircle, title: "Pedido on-line", text: "Faça seu pedido pelo WhatsApp." },
];

const reviews = [
  {
    name: "Pablo Rodolpho Fernandes Pereira",
    meta: "Local Guide · 25 avaliações · 207 fotos",
    when: "um ano atrás",
    text: "Pastel de atum e filé parmegiana é uma delícia.",
  },
  {
    name: "Aristoteles Assis",
    meta: "3 avaliações · 2 fotos",
    when: "4 anos atrás",
    text: "Não é o único, mais é o melhor!!!",
  },
  {
    name: "Gabriel Ferreira",
    meta: "Local Guide · 28 avaliações · 1 foto",
    when: "3 anos atrás",
    text: "Pizza muito boa!",
  },
];

const gallery = [
  { src: heroPizza, alt: "Pizza artesanal da Pizzaria Cantinho do Céu" },
  { src: parmegiana, alt: "Filé à parmegiana servido na Pizzaria Cantinho do Céu" },
  { src: pastel, alt: "Pastéis fritos dourados" },
  { src: ambiente, alt: "Ambiente aconchegante da pizzaria" },
];

const faqs = [
  {
    q: "Qual o horário de funcionamento?",
    a: "O atendimento começa às 17:00. Os demais horários e dias da semana não foram informados — confirme pelo telefone (84) 99989-4933.",
  },
  {
    q: "Vocês fazem entrega?",
    a: "Sim. A pizzaria oferece entrega sem contato, retirada na porta e refeição no local.",
  },
  {
    q: "Qual a faixa de preço?",
    a: "R$ 20–40 por pessoa, segundo informação de 8 pessoas no Google Maps.",
  },
  {
    q: "Onde vocês ficam?",
    a: `${ADDRESS} (Plus Code P65P+GW Alto do Rodrigues).`,
  },
  {
    q: "Como faço um pedido?",
    a: "Ligue ou chame no WhatsApp pelo número (84) 99989-4933.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: NAME,
  servesCuisine: "Pizza",
  priceRange: "R$ 20–40",
  telephone: PHONE_DISPLAY,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Av. Angelo Varela, 255 - Centro",
    addressLocality: "Alto do Rodrigues",
    addressRegion: "RN",
    postalCode: "59507-000",
    addressCountry: "BR",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "29",
  },
  sameAs: ["https://facebook.com"],
};

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Pizzaria Cantinho do Céu — Pizzaria em Alto do Rodrigues, RN" },
      {
        name: "description",
        content:
          "Pizzaria Cantinho do Céu em Alto do Rodrigues (RN): pizza artesanal, filé à parmegiana e pastéis. 4,8 estrelas no Google. Entrega, retirada e refeição no local.",
      },
      { property: "og:title", content: "Pizzaria Cantinho do Céu — Alto do Rodrigues, RN" },
      {
        property: "og:description",
        content:
          "A melhor parmegiana da cidade, pizza artesanal e pastéis. 4,8 ★ com 29 avaliações no Google.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }],
  }),
});

function Stars({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex gap-0.5 text-accent ${className}`} aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} className="h-4 w-4 fill-current" />
      ))}
    </span>
  );
}

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNodeLike;
}) {
  return (
    <section id={id} className="border-t border-border/60 px-5 py-20 md:py-28">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-accent">{eyebrow}</p>
          <h2 className="mt-3 text-4xl md:text-5xl">{title}</h2>
        </Reveal>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

type ReactNodeLike = React.ReactNode;

function Index() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <a href="#top" className="font-display text-xl tracking-widest">
            Cantinho <span className="text-gradient-ember">do Céu</span>
          </a>
          <nav className="hidden gap-7 text-sm text-muted-foreground md:flex">
            {[
              ["Sobre", "sobre"],
              ["Serviços", "servicos"],
              ["Galeria", "galeria"],
              ["Avaliações", "avaliacoes"],
              ["Localização", "localizacao"],
              ["Contato", "contato"],
            ].map(([label, href]) => (
              <a key={href} href={`#${href}`} className="transition-colors hover:text-foreground">
                {label}
              </a>
            ))}
          </nav>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full px-4 py-2 text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-105"
            style={{ background: "var(--gradient-ember)" }}
          >
            Pedir agora
          </a>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative flex min-h-screen items-end overflow-hidden">
        <img
          src={heroPizza}
          alt="Pizza artesanal assada da Pizzaria Cantinho do Céu"
          width={1600}
          height={1200}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "var(--gradient-veil)" }} />
        <div className="relative mx-auto w-full max-w-6xl px-5 pb-20 pt-28">
          <div className="animate-fade">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-1.5 text-sm backdrop-blur">
              <Stars />
              <span className="font-bold">4,8</span>
              <span className="text-muted-foreground">· 29 avaliações no Google</span>
            </div>
          </div>
          <h1 className="mt-6 max-w-3xl text-6xl leading-[0.95] animate-rise md:text-8xl">
            Pizzaria <span className="text-gradient-ember">Cantinho do Céu</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground animate-rise">
            Pizzaria em Alto do Rodrigues (RN). Pizza artesanal, filé à parmegiana e pastéis —
            R$ 20–40 por pessoa.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 animate-rise">
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-105"
              style={{ background: "var(--gradient-ember)" }}
            >
              <MessageCircle className="h-5 w-5" /> WhatsApp
            </a>
            <a
              href={`tel:${PHONE_TEL}`}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-6 py-3 font-bold backdrop-blur transition-colors hover:bg-card"
            >
              <Phone className="h-5 w-5" /> {PHONE_DISPLAY}
            </a>
            <a
              href={MAPS_ROUTE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-6 py-3 font-bold backdrop-blur transition-colors hover:bg-card"
            >
              <Navigation className="h-5 w-5" /> Traçar rota
            </a>
          </div>
        </div>
      </section>

      {/* Sobre */}
      <Section id="sobre" eyebrow="Sobre" title="Não é a única, mas é a melhor">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <Reveal>
            <p className="text-lg leading-relaxed text-muted-foreground">
              A Pizzaria Cantinho do Céu fica na Av. Angelo Varela, no Centro de Alto do Rodrigues,
              no Rio Grande do Norte. Com 4,8 estrelas em 29 avaliações no Google, é conhecida pela
              pizza artesanal, pelo filé à parmegiana e pelo pastel de atum.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                ["4,8", "nota no Google"],
                ["29", "avaliações"],
                ["R$ 20–40", "por pessoa"],
              ].map(([big, small]) => (
                <div key={small} className="rounded-2xl border border-border bg-card p-4 text-center">
                  <div className="font-display text-3xl text-accent">{big}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{small}</div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={120}>
            <img
              src={ambiente}
              alt="Ambiente interno aconchegante da pizzaria"
              loading="lazy"
              width={1024}
              height={1024}
              className="w-full rounded-3xl object-cover shadow-[var(--shadow-card)]"
            />
          </Reveal>
        </div>
      </Section>

      {/* Serviços */}
      <Section id="servicos" eyebrow="Serviços" title="Como você prefere pedir">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 90}>
              <div className="h-full rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)] transition-transform duration-300 hover:-translate-y-1.5">
                <s.icon className="h-8 w-8 text-primary" />
                <h3 className="mt-4 text-2xl">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200}>
          <p className="mt-6 text-sm text-muted-foreground">
            O cardápio completo não foi informado. Consulte os itens e preços pelo WhatsApp.
          </p>
        </Reveal>
      </Section>

      {/* Galeria */}
      <Section id="galeria" eyebrow="Galeria" title="Gastronomia da casa">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {gallery.map((g, i) => (
            <Reveal key={g.alt} delay={i * 80}>
              <div className="group overflow-hidden rounded-3xl border border-border">
                <img
                  src={g.src}
                  alt={g.alt}
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="mt-6 text-sm text-muted-foreground">
            Imagens ilustrativas — as fotos oficiais do estabelecimento não foram fornecidas.
          </p>
        </Reveal>
      </Section>

      {/* Avaliações */}
      <Section id="avaliacoes" eyebrow="Avaliações" title="O que os clientes destacam">
        <Reveal>
          <div className="flex flex-wrap gap-3">
            {["A melhor parmegiana da cidade", "Pastel de atum é uma delícia", "Pizza muito boa"].map(
              (h) => (
                <span
                  key={h}
                  className="rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-medium text-accent"
                >
                  {h}
                </span>
              ),
            )}
          </div>
        </Reveal>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {reviews.map((r, i) => (
            <Reveal key={r.name} delay={i * 100}>
              <figure className="flex h-full flex-col rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
                <Stars />
                <blockquote className="mt-4 flex-1 text-lg">“{r.text}”</blockquote>
                <figcaption className="mt-5 border-t border-border pt-4">
                  <div className="font-bold">{r.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {r.meta} · {r.when}
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Localização + Horários */}
      <Section id="localizacao" eyebrow="Localização" title="Venha nos visitar">
        <div className="grid gap-8 lg:grid-cols-2">
          <Reveal>
            <div className="overflow-hidden rounded-3xl border border-border">
              <iframe
                title={`Mapa da ${NAME}`}
                src={MAPS_EMBED}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[380px] w-full border-0"
              />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="space-y-5">
              <div className="flex gap-4 rounded-3xl border border-border bg-card p-6">
                <MapPin className="h-6 w-6 shrink-0 text-primary" />
                <div>
                  <h3 className="text-xl">Endereço</h3>
                  <p className="mt-1 text-muted-foreground">{ADDRESS}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Plus Code: P65P+GW Alto do Rodrigues, Rio Grande do Norte
                  </p>
                  <a
                    href={MAPS_ROUTE}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-accent hover:underline"
                  >
                    <Navigation className="h-4 w-4" /> Traçar rota no Google Maps
                  </a>
                </div>
              </div>
              <div id="horarios" className="flex gap-4 rounded-3xl border border-border bg-card p-6">
                <Clock className="h-6 w-6 shrink-0 text-primary" />
                <div>
                  <h3 className="text-xl">Horários</h3>
                  <p className="mt-1 text-muted-foreground">Abertura às 17:00.</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    O horário completo por dia da semana não foi informado. Confirme pelo telefone
                    antes de ir.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Contato */}
      <Section id="contato" eyebrow="Contato" title="Fale com a gente">
        <div className="grid gap-5 sm:grid-cols-3">
          <Reveal>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-full flex-col rounded-3xl border border-border bg-card p-6 transition-transform hover:-translate-y-1.5"
            >
              <MessageCircle className="h-7 w-7 text-primary" />
              <h3 className="mt-4 text-2xl">WhatsApp</h3>
              <p className="mt-1 text-muted-foreground">{PHONE_DISPLAY}</p>
            </a>
          </Reveal>
          <Reveal delay={90}>
            <a
              href={`tel:${PHONE_TEL}`}
              className="flex h-full flex-col rounded-3xl border border-border bg-card p-6 transition-transform hover:-translate-y-1.5"
            >
              <Phone className="h-7 w-7 text-primary" />
              <h3 className="mt-4 text-2xl">Telefone</h3>
              <p className="mt-1 text-muted-foreground">{PHONE_DISPLAY}</p>
            </a>
          </Reveal>
          <Reveal delay={180}>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-full flex-col rounded-3xl border border-border bg-card p-6 transition-transform hover:-translate-y-1.5"
            >
              <Facebook className="h-7 w-7 text-primary" />
              <h3 className="mt-4 text-2xl">Facebook</h3>
              <p className="mt-1 text-muted-foreground">facebook.com</p>
            </a>
          </Reveal>
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq" eyebrow="FAQ" title="Perguntas frequentes">
        <div className="mx-auto max-w-3xl space-y-3">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 60}>
              <div className="overflow-hidden rounded-2xl border border-border bg-card">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-bold"
                >
                  {f.q}
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-accent transition-transform duration-300 ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ${
                    openFaq === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-muted-foreground">{f.a}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <footer className="border-t border-border px-5 py-10 text-sm text-muted-foreground">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-display text-lg tracking-widest text-foreground">{NAME}</span>
          <span>{ADDRESS}</span>
        </div>
      </footer>

      {/* Botão flutuante WhatsApp */}
      <a
        href={WHATSAPP}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Abrir conversa no WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-110"
        style={{ background: "var(--gradient-ember)" }}
      >
        <MessageCircle className="h-7 w-7" />
      </a>
    </div>
  );
}
