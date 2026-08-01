import { MessageCircle } from "lucide-react";

import { whatsappLink } from "@/lib/catalog";

export function WhatsAppFab({ whatsapp }: { whatsapp: string }) {
  return (
    <a
      href={whatsappLink(whatsapp, "Olá, Rita Makes! Vim pelo site e gostaria de atendimento.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-6 right-6 z-50 grid size-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-lift transition hover:scale-105"
    >
      <MessageCircle className="size-6" />
    </a>
  );
}
