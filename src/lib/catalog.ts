export type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  sort_order: number;
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  category_id: string | null;
  description: string;
  price: number;
  sale_price: number | null;
  image_url: string;
  stock: number;
  is_featured: boolean;
  sales_count: number;
  created_at: string;
};

export type StoreSettings = {
  id: string;
  store_name: string;
  whatsapp: string;
  instagram: string;
  address: string;
  opening_hours: string;
  footer_note: string;
};

export const FALLBACK_SETTINGS: StoreSettings = {
  id: "",
  store_name: "Rita Makes",
  whatsapp: "5584900000000",
  instagram: "ritamakes",
  address: "Alto do Rodrigues — RN",
  opening_hours: "Seg a Sex: 8h às 18h | Sáb: 8h às 12h",
  footer_note: "Sua beleza merece os melhores produtos.",
};

export function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export function finalPrice(product: Product) {
  return product.sale_price ?? product.price;
}

export function discountPercent(product: Product) {
  if (!product.sale_price || product.sale_price >= product.price) return 0;
  return Math.round((1 - product.sale_price / product.price) * 100);
}

export function isNew(product: Product) {
  const days = (Date.now() - new Date(product.created_at).getTime()) / 86_400_000;
  return days <= 15;
}

export function whatsappLink(whatsapp: string, message: string) {
  return `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

export function productMessage(product: Product, storeName: string) {
  return `Olá, ${storeName}! Tenho interesse no produto *${product.name}*${
    product.brand ? ` (${product.brand})` : ""
  } — ${formatBRL(finalPrice(product))}. Ainda está disponível?`;
}
