"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart, cartTotal } from "@/hooks/use-cart";

export default function CartPage() {
  const boxes = useCart((state) => state.boxes);
  const removeBox = useCart((state) => state.removeBox);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (boxes.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl text-cocoa-900">
          Your cart is empty
        </h1>
        <p className="mt-3 text-cocoa-700">
          Build a box of gourmet cookies to get started.
        </p>
        <Button
          render={<Link href="/build-a-box" />}
          nativeButton={false}
          size="lg"
          className="mt-8 h-11 rounded-md bg-pink-500 px-6 text-cream-50 hover:bg-pink-600"
        >
          Build a Box <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  const total = cartTotal(boxes);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-display text-4xl text-cocoa-900">Your cart</h1>

      <div className="mt-10 space-y-4">
        {boxes.map((box) => (
          <div
            key={box.cartItemId}
            className="flex items-start justify-between gap-4 rounded-md border border-clay-200 bg-[#fffcf6] p-5 shadow-[0_2px_12px_rgba(74,46,35,0.08)]"
          >
            <div>
              <p className="font-display text-lg text-cocoa-900">
                {box.boxSizeName}
              </p>
              <p className="mt-1 text-sm text-cocoa-700">
                {box.flavors
                  .map((f) => `${f.quantity}× ${f.name}`)
                  .join(", ")}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-4">
              <p className="font-display text-lg text-cocoa-900">
                ₹{box.unitPrice}
              </p>
              <button
                onClick={() => removeBox(box.cartItemId)}
                aria-label="Remove box"
                className="text-cocoa-700/60 transition-colors hover:text-alert-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-between border-t border-clay-200 pt-6">
        <p className="font-display text-xl text-cocoa-900">Total</p>
        <p className="font-display text-2xl text-cocoa-900">₹{total}</p>
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          render={<Link href="/build-a-box" />}
          nativeButton={false}
          variant="outline"
          className="h-11 rounded-md border-cocoa-700 px-6 text-cocoa-900 hover:bg-cream-100"
        >
          Add Another Box
        </Button>
        <Button
          render={<Link href="/checkout" />}
          nativeButton={false}
          className="h-11 rounded-md bg-pink-500 px-6 text-cream-50 hover:bg-pink-600"
        >
          Checkout <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
