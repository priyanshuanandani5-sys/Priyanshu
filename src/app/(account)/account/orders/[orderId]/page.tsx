import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OrderStatusTimeline } from "@/components/account/order-status-timeline";

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Kolkata",
});

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*, addresses(*)")
    .eq("id", orderId)
    .maybeSingle();

  if (!order) notFound();

  const { data: items } = await supabase
    .from("order_items")
    .select("quantity, unit_price, flavors(name), box_sizes(name, cookie_count)")
    .eq("order_id", orderId);

  const orderNumber = order.id.slice(0, 8).toUpperCase();
  const address = order.addresses;

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.16em] text-pink-600">
        Order #{orderNumber}
      </p>
      <h1 className="mt-2 font-display text-3xl text-cocoa-900">
        Placed {dateFormatter.format(new Date(order.created_at))}
      </h1>

      <div className="mt-10 grid gap-10 md:grid-cols-[1fr_1.3fr]">
        <div>
          <h2 className="font-display text-lg text-cocoa-900">Status</h2>
          <div className="mt-4">
            <OrderStatusTimeline
              status={order.status}
              fulfillmentType={order.fulfillment_type}
            />
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="font-display text-lg text-cocoa-900">Order details</h2>
            <div className="mt-3 space-y-1.5 text-sm text-cocoa-700">
              {items?.map((item, i) => (
                <p key={i}>
                  {item.quantity}× {item.flavors?.name}{" "}
                  <span className="text-cocoa-700/60">
                    ({item.box_sizes?.name})
                  </span>
                </p>
              ))}
            </div>
            <div className="mt-4 flex justify-between border-t border-clay-200 pt-3">
              <span className="text-cocoa-900">Total</span>
              <span className="font-display text-lg text-cocoa-900">
                ₹{order.total}
              </span>
            </div>
          </div>

          <div>
            <h2 className="font-display text-lg text-cocoa-900">Fulfillment</h2>
            <p className="mt-2 text-sm text-cocoa-700">
              {order.fulfillment_type === "pickup" ? (
                "Self-pickup"
              ) : (
                <>
                  Delivery to {address?.line1}
                  {address?.line2 ? `, ${address.line2}` : ""}, {address?.pincode}
                </>
              )}
            </p>
            {order.upi_ref && (
              <p className="mt-1 text-sm text-cocoa-700/70">
                UPI reference: {order.upi_ref}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
