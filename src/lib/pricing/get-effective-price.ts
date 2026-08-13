import type { Tables } from "@/lib/types/database.types";

export type BoxSize = Tables<"box_sizes">;

/**
 * Returns the price that applies right now for a box size, honoring the
 * promo window if one is active. Always recompute this server-side at order
 * creation time — never trust a client-submitted price.
 */
export function getEffectivePrice(box: BoxSize, now: Date = new Date()): number {
  if (box.promo_price != null && box.promo_starts_at && box.promo_ends_at) {
    const starts = new Date(box.promo_starts_at).getTime();
    const ends = new Date(box.promo_ends_at).getTime();
    const t = now.getTime();
    if (t >= starts && t <= ends) {
      return box.promo_price;
    }
  }
  return box.base_price;
}

export function isPromoActive(box: BoxSize, now: Date = new Date()): boolean {
  return getEffectivePrice(box, now) !== box.base_price;
}
