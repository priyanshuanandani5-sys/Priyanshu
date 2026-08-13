"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { createClient } from "@/lib/supabase/client";
import { useCart, cartTotal } from "@/hooks/use-cart";
import type { Tables } from "@/lib/types/database.types";

type Address = Tables<"addresses">;

export default function CheckoutPage() {
  const router = useRouter();
  const boxes = useCart((state) => state.boxes);
  const clearCart = useCart((state) => state.clear);
  const [mounted, setMounted] = useState(false);

  const [fulfillmentType, setFulfillmentType] = useState<"pickup" | "delivery">(
    "pickup"
  );
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: "",
    line1: "",
    line2: "",
    pincode: "",
    contactName: "",
    contactPhone: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const supabase = createClient();
    supabase
      .from("addresses")
      .select("*")
      .order("is_default", { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setAddresses(data);
          setSelectedAddressId(data[0].id);
        } else {
          setUseNewAddress(true);
        }
      });
  }, []);

  if (!mounted) return null;

  if (boxes.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl text-cocoa-900">
          Your cart is empty
        </h1>
        <Button
          render={<Link href="/build-a-box" />}
          nativeButton={false}
          size="lg"
          className="mt-8 h-11 rounded-md bg-pink-500 px-6 text-cream-50 hover:bg-pink-600"
        >
          Build a Box
        </Button>
      </div>
    );
  }

  const total = cartTotal(boxes);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const payload: Record<string, unknown> = {
      boxes: boxes.map((box) => ({
        boxSizeId: box.boxSizeId,
        flavors: box.flavors.map((f) => ({
          flavorId: f.flavorId,
          quantity: f.quantity,
        })),
      })),
      fulfillmentType,
    };

    if (fulfillmentType === "delivery") {
      if (useNewAddress || !selectedAddressId) {
        payload.newAddress = newAddress;
      } else {
        payload.addressId = selectedAddressId;
      }
    }

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Something went wrong. Please try again.");
      setSubmitting(false);
      return;
    }

    clearCart();
    router.push(`/checkout/pay/${data.orderId}`);
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-4xl text-cocoa-900">Checkout</h1>

      <form onSubmit={handleSubmit} className="mt-10 space-y-10">
        <section>
          <h2 className="font-display text-xl text-cocoa-900">
            How would you like your order?
          </h2>
          <RadioGroup
            value={fulfillmentType}
            onValueChange={(v) => setFulfillmentType(v as "pickup" | "delivery")}
            className="mt-4 space-y-3"
          >
            <label className="flex cursor-pointer items-center gap-3 rounded-md border border-clay-200 bg-[#fffcf6] p-4 has-[[data-state=checked]]:border-pink-500">
              <RadioGroupItem value="pickup" id="pickup" />
              <span className="text-cocoa-900">Self-pickup</span>
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-md border border-clay-200 bg-[#fffcf6] p-4 has-[[data-state=checked]]:border-pink-500">
              <RadioGroupItem value="delivery" id="delivery" />
              <span className="text-cocoa-900">
                Local delivery (Vile Parle &amp; Juhu, within 2 days)
              </span>
            </label>
          </RadioGroup>
        </section>

        {fulfillmentType === "delivery" && (
          <section>
            <h2 className="font-display text-xl text-cocoa-900">
              Delivery address
            </h2>

            {addresses.length > 0 && !useNewAddress && (
              <div className="mt-4 space-y-3">
                <RadioGroup
                  value={selectedAddressId ?? undefined}
                  onValueChange={setSelectedAddressId}
                  className="space-y-3"
                >
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className="flex cursor-pointer items-start gap-3 rounded-md border border-clay-200 bg-[#fffcf6] p-4 has-[[data-state=checked]]:border-pink-500"
                    >
                      <RadioGroupItem value={addr.id} className="mt-1" />
                      <span className="text-sm text-cocoa-900">
                        {addr.label && (
                          <span className="font-medium">{addr.label} — </span>
                        )}
                        {addr.line1}
                        {addr.line2 ? `, ${addr.line2}` : ""}, {addr.pincode}
                      </span>
                    </label>
                  ))}
                </RadioGroup>
                <button
                  type="button"
                  onClick={() => setUseNewAddress(true)}
                  className="text-sm text-pink-600 hover:text-pink-700"
                >
                  + Use a new address
                </button>
              </div>
            )}

            {(useNewAddress || addresses.length === 0) && (
              <div className="mt-4 space-y-4">
                {addresses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setUseNewAddress(false)}
                    className="text-sm text-pink-600 hover:text-pink-700"
                  >
                    ← Use a saved address
                  </button>
                )}
                <div className="space-y-1.5">
                  <Label htmlFor="line1">Address</Label>
                  <Input
                    id="line1"
                    required
                    value={newAddress.line1}
                    onChange={(e) =>
                      setNewAddress((a) => ({ ...a, line1: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="line2">Apartment / floor (optional)</Label>
                  <Input
                    id="line2"
                    value={newAddress.line2}
                    onChange={(e) =>
                      setNewAddress((a) => ({ ...a, line2: e.target.value }))
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      required
                      inputMode="numeric"
                      value={newAddress.pincode}
                      onChange={(e) =>
                        setNewAddress((a) => ({ ...a, pincode: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="label">Label (optional)</Label>
                    <Input
                      id="label"
                      placeholder="Home, Office…"
                      value={newAddress.label}
                      onChange={(e) =>
                        setNewAddress((a) => ({ ...a, label: e.target.value }))
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="contactName">Contact name</Label>
                    <Input
                      id="contactName"
                      required
                      value={newAddress.contactName}
                      onChange={(e) =>
                        setNewAddress((a) => ({ ...a, contactName: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="contactPhone">Phone</Label>
                    <Input
                      id="contactPhone"
                      required
                      inputMode="numeric"
                      value={newAddress.contactPhone}
                      onChange={(e) =>
                        setNewAddress((a) => ({ ...a, contactPhone: e.target.value }))
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        <section className="border-t border-clay-200 pt-6">
          <div className="flex items-center justify-between">
            <p className="font-display text-xl text-cocoa-900">Total</p>
            <p className="font-display text-2xl text-cocoa-900">₹{total}</p>
          </div>
        </section>

        {error && <p className="text-sm text-alert-500">{error}</p>}

        <Button
          type="submit"
          disabled={submitting}
          className="h-12 w-full rounded-md bg-pink-500 text-base text-cream-50 hover:bg-pink-600"
        >
          {submitting ? "Placing order…" : "Continue to Payment"}{" "}
          {!submitting && <ArrowRight className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  );
}
