"use client";

import { useActionState } from "react";
import { updateBoxSize, type ActionState } from "@/lib/actions/admin-catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BoxSize } from "@/lib/pricing/get-effective-price";

const initialState: ActionState = { error: null };

function toLocalInputValue(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function BoxSizeForm({ box }: { box: BoxSize }) {
  const [state, formAction, pending] = useActionState(updateBoxSize, initialState);

  return (
    <form
      action={formAction}
      className="max-w-lg space-y-4 rounded-md border border-clay-200 bg-[#fffcf6] p-6"
    >
      <input type="hidden" name="boxSizeId" value={box.id} />
      <div>
        <p className="font-display text-lg text-cocoa-900">{box.name}</p>
        <p className="text-sm text-cocoa-700">{box.cookie_count} cookies per box</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="basePrice">Regular price (₹)</Label>
        <Input
          id="basePrice"
          name="basePrice"
          type="number"
          step="0.01"
          required
          defaultValue={box.base_price}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="promoPrice">Promo price (₹, optional)</Label>
        <Input
          id="promoPrice"
          name="promoPrice"
          type="number"
          step="0.01"
          defaultValue={box.promo_price ?? ""}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="promoStartsAt">Promo starts</Label>
          <Input
            id="promoStartsAt"
            name="promoStartsAt"
            type="datetime-local"
            defaultValue={toLocalInputValue(box.promo_starts_at)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="promoEndsAt">Promo ends</Label>
          <Input
            id="promoEndsAt"
            name="promoEndsAt"
            type="datetime-local"
            defaultValue={toLocalInputValue(box.promo_ends_at)}
          />
        </div>
      </div>

      {state.error && <p className="text-sm text-alert-500">{state.error}</p>}
      {state.success && <p className="text-sm text-sage-600">Saved.</p>}

      <Button
        type="submit"
        disabled={pending}
        className="h-10 rounded-md bg-pink-500 px-5 text-cream-50 hover:bg-pink-600"
      >
        {pending ? "Saving…" : "Save pricing"}
      </Button>
    </form>
  );
}
