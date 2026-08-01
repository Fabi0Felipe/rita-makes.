import type { ReactNode } from "react";

import { Footer } from "./Footer";
import { Header } from "./Header";
import { WhatsAppFab } from "./WhatsAppFab";
import type { StoreSettings } from "@/lib/catalog";

export function SiteShell({
  settings,
  children,
}: {
  settings: StoreSettings;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header instagram={settings.instagram} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
      <WhatsAppFab whatsapp={settings.whatsapp} />
    </div>
  );
}
