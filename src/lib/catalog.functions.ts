import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const url = process.env["SUPABASE_URL"]!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const getCatalog = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();

  const [categories, products, settings] = await Promise.all([
    supabase.from("categories").select("id, name, slug, icon, sort_order").order("sort_order"),
    supabase
      .from("products")
      .select(
        "id, name, brand, category_id, description, price, sale_price, image_url, stock, is_featured, sales_count, created_at",
      )
      .order("created_at", { ascending: false }),
    supabase
      .from("store_settings")
      .select("id, store_name, whatsapp, instagram, address, opening_hours, footer_note")
      .limit(1)
      .maybeSingle(),
  ]);

  return {
    categories: categories.data ?? [],
    products: (products.data ?? []).map((p) => ({
      ...p,
      price: Number(p.price),
      sale_price: p.sale_price === null ? null : Number(p.sale_price),
    })),
    settings: settings.data ?? null,
  };
});
