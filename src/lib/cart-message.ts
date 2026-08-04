import { finalPrice, formatBRL, type Product } from "./catalog";
import type { CustomerInfo } from "./cart";

export type CartItem = { product: Product; qty: number };

export function lineTotal(item: CartItem) {
  return finalPrice(item.product) * item.qty;
}

export function cartTotals(items: CartItem[]) {
  const totalItems = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + lineTotal(i), 0);
  return { totalItems, subtotal, total: subtotal };
}

export function orderMessage(items: CartItem[], customer: CustomerInfo) {
  const { total } = cartTotals(items);

  const addressLines = [
    [customer.address, customer.number].filter(Boolean).join(", "),
    customer.district,
    customer.complement,
    customer.reference ? `Referência: ${customer.reference}` : "",
  ].filter(Boolean);

  const itemLines = items
    .map(
      (i) =>
        `• ${i.product.name}${i.product.brand ? ` - ${i.product.brand}` : ""}\nQuantidade: ${i.qty}\nValor: ${formatBRL(lineTotal(i))}`,
    )
    .join("\n\n");

  return [
    "Olá! Gostaria de realizar este pedido.",
    "",
    "Nome:",
    customer.name,
    "",
    "Endereço:",
    addressLines.join("\n"),
    ...(customer.phone ? ["", "Telefone:", customer.phone] : []),
    "",
    "Itens:",
    "",
    itemLines,
    "",
    "Total do Pedido:",
    formatBRL(total),
    "",
    "Obrigado!",
  ].join("\n");
}
