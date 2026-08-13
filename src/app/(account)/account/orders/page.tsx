import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const STATUS_LABELS: Record<string, string> = {
  pending_payment: "Payment pending",
  paid: "Payment confirmed",
  preparing: "Preparing",
  ready_for_pickup: "Ready for pickup",
  out_for_delivery: "Out for delivery",
  completed: "Completed",
  cancelled: "Cancelled",
};

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeZone: "Asia/Kolkata",
});

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-3xl text-cocoa-900">Your orders</h1>

      {!orders || orders.length === 0 ? (
        <div className="mt-8">
          <p className="text-cocoa-700">You haven&apos;t placed an order yet.</p>
          <Link
            href="/build-a-box"
            className="mt-3 inline-block text-pink-600 hover:text-pink-700"
          >
            Build your first box →
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="block rounded-md border border-clay-200 bg-[#fffcf6] p-5 shadow-[0_2px_12px_rgba(74,46,35,0.08)] transition-colors hover:border-pink-500"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-display text-lg text-cocoa-900">
                  Order #{order.id.slice(0, 8).toUpperCase()}
                </p>
                <p className="text-sm text-cocoa-700">
                  {dateFormatter.format(new Date(order.created_at))}
                </p>
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-full bg-cream-100 px-3 py-1 text-xs text-cocoa-700">
                  {STATUS_LABELS[order.status] ?? order.status}
                </span>
                <p className="font-display text-lg text-cocoa-900">
                  ₹{order.total}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
