import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { buildUpiLink } from "@/lib/upi/build-upi-link";
import { UpiQrCode } from "@/components/checkout/upi-qr-code";
import { Button } from "@/components/ui/button";

export default async function PayPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .maybeSingle();

  if (!order) notFound();

  const orderNumber = order.id.slice(0, 8).toUpperCase();
  const upiLink = buildUpiLink({ amount: order.total, orderNumber });

  return (
    <div className="mx-auto max-w-lg px-6 py-16 text-center">
      <p className="text-xs uppercase tracking-[0.16em] text-pink-600">
        Order #{orderNumber}
      </p>
      <h1 className="mt-3 font-display text-3xl text-cocoa-900">
        Pay ₹{order.total} via UPI
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-cocoa-700">
        On your phone, tap the button below to pay with GPay, PhonePe, or any
        UPI app. On desktop, scan the QR code with your phone.
      </p>

      <div className="mt-8 flex justify-center">
        <UpiQrCode data={upiLink} />
      </div>

      <Button
        render={<a href={upiLink} />}
        nativeButton={false}
        size="lg"
        className="mt-8 h-12 w-full rounded-md bg-pink-500 text-base text-cream-50 hover:bg-pink-600"
      >
        Pay via UPI App
      </Button>

      <div className="mt-10 rounded-md border border-clay-200 bg-cream-100 p-5 text-left">
        <p className="text-sm text-cocoa-800">
          After paying, tap below — we&apos;ll verify your payment by hand and
          confirm your order shortly.
        </p>
        <Button
          render={<Link href={`/order-confirmed/${order.id}`} />}
          nativeButton={false}
          variant="outline"
          className="mt-4 h-11 w-full rounded-md border-cocoa-700 text-cocoa-900 hover:bg-cream-50"
        >
          I&apos;ve Paid
        </Button>
      </div>
    </div>
  );
}
