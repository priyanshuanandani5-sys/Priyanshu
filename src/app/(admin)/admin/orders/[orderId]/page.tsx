import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { markOrderPaid, updateOrderStatus } from "@/lib/actions/admin-orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

function nextStatusOptions(current: string, fulfillmentType: string): string[] {
  const readyStatus = fulfillmentType === "delivery" ? "out_for_delivery" : "ready_for_pickup";
  switch (current) {
    case "paid":
      return ["preparing", "cancelled"];
    case "preparing":
      return [readyStatus, "cancelled"];
    case "ready_for_pickup":
    case "out_for_delivery":
      return ["completed", "cancelled"];
    default:
      return [];
  }
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*, profiles(full_name), addresses(*)")
    .eq("id", orderId)
    .maybeSingle();

  if (!order) notFound();

  const { data: items } = await supabase
    .from("order_items")
    .select("quantity, unit_price, flavors(name), box_sizes(name)")
    .eq("order_id", orderId)
    .order("quantity", { ascending: false });

  const orderNumber = order.id.slice(0, 8).toUpperCase();
  const address = order.addresses;
  const options = nextStatusOptions(order.status, order.fulfillment_type);

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.16em] text-pink-600">
        Order #{orderNumber}
      </p>
      <h1 className="mt-2 font-display text-3xl text-cocoa-900">
        {STATUS_LABELS[order.status] ?? order.status}
      </h1>
      <p className="mt-1 text-sm text-cocoa-700">
        Placed {dateFormatter.format(new Date(order.created_at))} by{" "}
        {order.profiles?.full_name ?? "customer"}
      </p>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-md border border-clay-200 bg-[#fffcf6] p-5">
            <h2 className="font-display text-lg text-cocoa-900">
              Flavor breakdown (kitchen prep)
            </h2>
            <div className="mt-3 space-y-1.5 text-sm text-cocoa-800">
              {items?.map((item, i) => (
                <p key={i}>
                  <span className="font-medium">{item.quantity}×</span>{" "}
                  {item.flavors?.name}
                </p>
              ))}
            </div>
            <div className="mt-4 flex justify-between border-t border-clay-200 pt-3">
              <span>Total</span>
              <span className="font-display text-lg text-cocoa-900">
                ₹{order.total}
              </span>
            </div>
          </div>

          <div className="rounded-md border border-clay-200 bg-[#fffcf6] p-5">
            <h2 className="font-display text-lg text-cocoa-900">Fulfillment</h2>
            <p className="mt-2 text-sm capitalize text-cocoa-800">
              {order.fulfillment_type}
            </p>
            {address && (
              <p className="mt-1 text-sm text-cocoa-700">
                {address.line1}
                {address.line2 ? `, ${address.line2}` : ""}, {address.pincode}
                <br />
                {address.contact_name} · {address.contact_phone}
              </p>
            )}
            {order.notes && (
              <p className="mt-2 text-sm italic text-cocoa-700">
                &ldquo;{order.notes}&rdquo;
              </p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {order.status === "pending_payment" && (
            <form
              action={markOrderPaid}
              className="rounded-md border border-pink-500/40 bg-pink-500/5 p-5"
            >
              <input type="hidden" name="orderId" value={order.id} />
              <h2 className="font-display text-lg text-cocoa-900">Mark as paid</h2>
              <p className="mt-1 text-sm text-cocoa-700">
                After confirming the payment in GPay, record the UTR/reference
                number here.
              </p>
              <div className="mt-3 space-y-1.5">
                <Label htmlFor="upiRef">UPI reference (optional)</Label>
                <Input id="upiRef" name="upiRef" placeholder="e.g. 123456789012" />
              </div>
              <Button
                type="submit"
                className="mt-4 h-10 rounded-md bg-pink-500 px-5 text-cream-50 hover:bg-pink-600"
              >
                Mark as Paid
              </Button>
            </form>
          )}

          {order.upi_ref && (
            <p className="text-sm text-cocoa-700">
              UPI reference: <span className="font-medium">{order.upi_ref}</span>
            </p>
          )}

          {options.length > 0 && (
            <div className="rounded-md border border-clay-200 bg-[#fffcf6] p-5">
              <h2 className="font-display text-lg text-cocoa-900">
                Update status
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {options.map((status) => (
                  <form key={status} action={updateOrderStatus}>
                    <input type="hidden" name="orderId" value={order.id} />
                    <input type="hidden" name="status" value={status} />
                    <Button
                      type="submit"
                      variant={status === "cancelled" ? "outline" : "default"}
                      className={
                        status === "cancelled"
                          ? "h-9 rounded-md border-alert-500 text-alert-500 hover:bg-alert-500/10"
                          : "h-9 rounded-md bg-pink-500 text-cream-50 hover:bg-pink-600"
                      }
                    >
                      {STATUS_LABELS[status]}
                    </Button>
                  </form>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
