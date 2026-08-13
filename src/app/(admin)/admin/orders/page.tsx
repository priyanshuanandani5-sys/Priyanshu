import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const STATUSES = [
  "pending_payment",
  "paid",
  "preparing",
  "ready_for_pickup",
  "out_for_delivery",
  "completed",
  "cancelled",
] as const;

const STATUS_LABELS: Record<string, string> = {
  pending_payment: "Payment pending",
  paid: "Paid",
  preparing: "Preparing",
  ready_for_pickup: "Ready for pickup",
  out_for_delivery: "Out for delivery",
  completed: "Completed",
  cancelled: "Cancelled",
};

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Kolkata",
});

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("orders")
    .select("*, profiles(full_name)")
    .order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);

  const { data: orders } = await query;

  return (
    <div>
      <h1 className="font-display text-3xl text-cocoa-900">Orders</h1>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/admin/orders"
          className={`rounded-full px-3 py-1 text-xs ${
            !status
              ? "bg-pink-500 text-cream-50"
              : "bg-cream-100 text-cocoa-700"
          }`}
        >
          All
        </Link>
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
            className={`rounded-full px-3 py-1 text-xs ${
              status === s
                ? "bg-pink-500 text-cream-50"
                : "bg-cream-100 text-cocoa-700"
            }`}
          >
            {STATUS_LABELS[s]}
          </Link>
        ))}
      </div>

      <div className="mt-8 overflow-x-auto rounded-md border border-clay-200 bg-[#fffcf6]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-clay-200 text-left text-xs uppercase tracking-wide text-cocoa-700/60">
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Fulfillment</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Placed</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <tr
                key={order.id}
                className="border-b border-clay-100 last:border-0 hover:bg-cream-100"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="font-medium text-pink-600 hover:text-pink-700"
                  >
                    #{order.id.slice(0, 8).toUpperCase()}
                  </Link>
                </td>
                <td className="px-4 py-3 text-cocoa-800">
                  {order.profiles?.full_name ?? "—"}
                </td>
                <td className="px-4 py-3 capitalize text-cocoa-800">
                  {order.fulfillment_type}
                </td>
                <td className="px-4 py-3 text-cocoa-800">
                  {STATUS_LABELS[order.status] ?? order.status}
                </td>
                <td className="px-4 py-3 text-cocoa-800">₹{order.total}</td>
                <td className="px-4 py-3 text-cocoa-700/70">
                  {dateFormatter.format(new Date(order.created_at))}
                </td>
              </tr>
            ))}
            {orders?.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-cocoa-700">
                  No orders here.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
