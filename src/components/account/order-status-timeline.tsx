import { Check } from "lucide-react";

const PICKUP_STEPS = [
  { key: "pending_payment", label: "Payment pending" },
  { key: "paid", label: "Payment confirmed" },
  { key: "preparing", label: "Preparing your box" },
  { key: "ready_for_pickup", label: "Ready for pickup" },
  { key: "completed", label: "Completed" },
] as const;

const DELIVERY_STEPS = [
  { key: "pending_payment", label: "Payment pending" },
  { key: "paid", label: "Payment confirmed" },
  { key: "preparing", label: "Preparing your box" },
  { key: "out_for_delivery", label: "Out for delivery" },
  { key: "completed", label: "Completed" },
] as const;

export function OrderStatusTimeline({
  status,
  fulfillmentType,
}: {
  status: string;
  fulfillmentType: string;
}) {
  if (status === "cancelled") {
    return (
      <div className="rounded-md border border-alert-500/30 bg-alert-500/10 p-4 text-sm text-alert-600">
        This order was cancelled.
      </div>
    );
  }

  const steps = fulfillmentType === "delivery" ? DELIVERY_STEPS : PICKUP_STEPS;
  const currentIndex = steps.findIndex((s) => s.key === status);

  return (
    <ol className="space-y-0">
      {steps.map((step, i) => {
        const reached = i <= currentIndex;
        const isLast = i === steps.length - 1;
        return (
          <li key={step.key} className="relative flex gap-4 pb-8 last:pb-0">
            {!isLast && (
              <span
                className={`absolute left-[11px] top-6 h-full w-px ${
                  i < currentIndex ? "bg-sage-500" : "bg-clay-200"
                }`}
              />
            )}
            <span
              className={`z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                reached
                  ? "bg-sage-500 text-cream-50"
                  : "border border-clay-300 bg-cream-50 text-clay-300"
              }`}
            >
              {reached && <Check className="h-3.5 w-3.5" />}
            </span>
            <span
              className={`pt-0.5 text-sm ${
                reached ? "text-cocoa-900" : "text-cocoa-700/50"
              } ${i === currentIndex ? "font-medium" : ""}`}
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
