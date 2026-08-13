export type DeliveryArea = "vile_parle" | "juhu";

/**
 * Placeholder allow-list — confirm the exact serviceable pincodes with the
 * business owner before launch and expand this list. Vile Parle West/East
 * and Juhu are the neighborhoods currently confirmed as in-scope.
 */
export const PINCODES_BY_AREA: Record<DeliveryArea, string[]> = {
  vile_parle: ["400056", "400057"],
  juhu: ["400049"],
};

export function areaForPincode(pincode: string): DeliveryArea | null {
  const trimmed = pincode.trim();
  for (const [area, pincodes] of Object.entries(PINCODES_BY_AREA) as [
    DeliveryArea,
    string[],
  ][]) {
    if (pincodes.includes(trimmed)) return area;
  }
  return null;
}

export function isServiceablePincode(pincode: string): boolean {
  return areaForPincode(pincode) !== null;
}
