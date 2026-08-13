/**
 * Single source of truth for the UPI payment deep link. Every caller reads
 * the UPI ID/payee name from here rather than hardcoding the literal string.
 */
export function buildUpiLink({
  amount,
  orderNumber,
}: {
  amount: number;
  orderNumber: string;
}): string {
  const pa = process.env.NEXT_PUBLIC_UPI_ID!;
  const pn = process.env.NEXT_PUBLIC_UPI_PAYEE_NAME ?? "Bite Sized Cookies";
  const note = `Order ${orderNumber}`;

  const params = new URLSearchParams({
    pa,
    pn,
    am: amount.toFixed(2),
    cu: "INR",
    tn: note,
  });

  return `upi://pay?${params.toString()}`;
}
