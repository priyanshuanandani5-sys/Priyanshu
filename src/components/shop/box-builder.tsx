"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FlavorImage } from "@/components/shop/flavor-image";
import { useCart } from "@/hooks/use-cart";
import type { Flavor } from "@/lib/data/flavors";
import type { BoxSize } from "@/lib/pricing/get-effective-price";

export function BoxBuilder({
  box,
  flavors,
  price,
}: {
  box: BoxSize;
  flavors: Flavor[];
  price: number;
}) {
  const [selections, setSelections] = useState<Record<string, number>>({});
  const addBox = useCart((state) => state.addBox);
  const router = useRouter();

  const total = useMemo(
    () => Object.values(selections).reduce((sum, n) => sum + n, 0),
    [selections]
  );
  const remaining = box.cookie_count - total;
  const isComplete = remaining === 0;

  function increment(flavorId: string) {
    if (remaining <= 0) return;
    setSelections((s) => ({ ...s, [flavorId]: (s[flavorId] ?? 0) + 1 }));
  }

  function decrement(flavorId: string) {
    setSelections((s) => {
      const next = { ...s };
      const current = next[flavorId] ?? 0;
      if (current <= 1) {
        delete next[flavorId];
      } else {
        next[flavorId] = current - 1;
      }
      return next;
    });
  }

  function handleAddToCart() {
    if (!isComplete) return;
    addBox({
      boxSizeId: box.id,
      boxSizeName: box.name,
      cookieCount: box.cookie_count,
      unitPrice: price,
      flavors: Object.entries(selections).map(([flavorId, quantity]) => ({
        flavorId,
        quantity,
        name: flavors.find((f) => f.id === flavorId)?.name ?? "Flavor",
      })),
    });
    toast.success("Box added to cart", {
      description: `${box.name} — ${box.cookie_count} cookies, ₹${price}`,
      action: {
        label: "View cart",
        onClick: () => router.push("/cart"),
      },
    });
    setSelections({});
  }

  return (
    <div>
      <div className="sticky top-20 z-30 -mx-6 mb-8 border-y border-clay-200 bg-cream-100/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-cream-100/80">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <p className="font-display text-lg text-cocoa-900">
            {isComplete
              ? `${box.cookie_count} of ${box.cookie_count} cookies picked`
              : `Pick ${remaining} more of ${box.cookie_count} cookies`}
          </p>
          <Button
            onClick={handleAddToCart}
            disabled={!isComplete}
            className="h-11 rounded-md bg-pink-500 px-6 text-cream-50 hover:bg-pink-600 disabled:bg-clay-300 disabled:text-cocoa-700/50"
          >
            Add Box to Cart — ₹{price}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {flavors.map((flavor) => {
          const count = selections[flavor.id] ?? 0;
          return (
            <div
              key={flavor.id}
              className={`overflow-hidden rounded-md border shadow-[0_2px_12px_rgba(74,46,35,0.08)] transition-colors ${
                count > 0
                  ? "border-pink-500 bg-pink-300/10"
                  : "border-clay-200 bg-[#fffcf6]"
              }`}
            >
              <FlavorImage
                name={flavor.name}
                imagePath={flavor.image_path}
                className="h-36 w-full"
              />
              <div className="p-5">
                <p className="font-display text-lg text-cocoa-900">
                  {flavor.name}
                </p>
                {flavor.description && (
                  <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-cocoa-700">
                    {flavor.description}
                  </p>
                )}

                <div className="mt-4 flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => decrement(flavor.id)}
                    disabled={count === 0}
                    aria-label={`Remove one ${flavor.name}`}
                    className="rounded-full border-cocoa-700 text-cocoa-900"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </Button>
                  <span className="font-display text-lg text-cocoa-900">
                    {count}
                  </span>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => increment(flavor.id)}
                    disabled={remaining <= 0}
                    aria-label={`Add one ${flavor.name}`}
                    className="rounded-full border-cocoa-700 text-cocoa-900"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
