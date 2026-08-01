import { Link } from "@tanstack/react-router";
import { Clock, Instagram, MapPin, Phone, Sparkles } from "lucide-react";

import { whatsappLink, type StoreSettings } from "@/lib/catalog";

export function Footer({ settings }: { settings: StoreSettings }) {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-full bg-gradient-rose">
              <Sparkles className="size-4 text-wine" />
            </span>
            <span className="font-display text-2xl text-wine">
              Rita <span className="italic text-primary">Makes</span>
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">{settings.footer_note}</p>
        </div>

        <div>
          <h3 className="font-display text-lg text-wine">Navegação</h3>
          <ul className="mt-4 grid gap-2 text-sm text-muted-foreground">
            <li>
              <Link to="/produtos" className="transition hover:text-primary">
                Todos os produtos
              </Link>
            </li>
            <li>
              <Link to="/novidades" className="transition hover:text-primary">
                Novidades
              </Link>
            </li>
            <li>
              <Link to="/promocoes" className="transition hover:text-primary">
                Promoções
              </Link>
            </li>
            <li>
              <Link to="/contato" className="transition hover:text-primary">
                Contato
              </Link>
            </li>
            <li>
              <Link to="/auth" className="transition hover:text-primary">
                Área administrativa
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-lg text-wine">Atendimento</h3>
          <ul className="mt-4 grid gap-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
              {settings.address}
            </li>
            <li className="flex items-start gap-2">
              <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
              {settings.opening_hours}
            </li>
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
              <a
                href={whatsappLink(settings.whatsapp, "Olá, Rita Makes! Gostaria de mais informações.")}
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-primary"
              >
                Falar no WhatsApp
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Instagram className="mt-0.5 size-4 shrink-0 text-primary" />
              <a
                href={`https://instagram.com/${settings.instagram}`}
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-primary"
              >
                @{settings.instagram}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Rita Makes — Alto do Rodrigues, RN. Todos os direitos reservados.
      </div>
    </footer>
  );
}
