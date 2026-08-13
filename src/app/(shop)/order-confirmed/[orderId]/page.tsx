import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

export default async function OrderConfirmedPage({
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

  return (
    <div className="mx-auto max-w-lg px-6 py-24 text-center">
      <p className="text-xs uppercase tracking-[0.16em] text-pink-600">
        Order #{orderNumber}
      </p>
      <h1 className="mt-3 font-display text-3xl text-cocoa-900">
        Thanks — we&apos;re on it.
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-cocoa-700">
        We&apos;ll verify your payment shortly and start baking. You can
        track your order status anytime from your account.
      </p>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button
          render={<Link href={`/account/orders/${order.id}`} />}
          nativeButton={false}
          className="h-11 rounded-md bg-pink-500 px-6 text-cream-50 hover:bg-pink-600"
        >
          Track This Order
        </Button>
        <Button
          render={<Link href="/build-a-box" />}
          nativeButton={false}
          variant="outline"
          className="h-11 rounded-md border-cocoa-700 px-6 text-cocoa-900 hover:bg-cream-100"
        >
          Order More
        </Button>
      </div>
    </div>
  );
}
