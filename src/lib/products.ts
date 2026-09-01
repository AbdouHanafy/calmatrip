// Shared convention for representing "unlimited stock" on a Product without
// a schema/nullable-column change — `Product.stock` stays a plain
// `Int @default(100)` (checkout, cart and every stock comparison already
// operate on a plain number and keep working unmodified), and a partner
// choosing "Illimité" in the form simply submits this sentinel value.
export const UNLIMITED_STOCK = 999_999;

export function isUnlimitedStock(stock: number): boolean {
  return stock >= UNLIMITED_STOCK;
}
