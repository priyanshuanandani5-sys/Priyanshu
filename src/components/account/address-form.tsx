"use client";

import { useActionState, useEffect } from "react";
import { upsertAddress, type ActionState } from "@/lib/actions/account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Tables } from "@/lib/types/database.types";

const initialState: ActionState = { error: null };

export function AddressForm({
  address,
  onDone,
}: {
  address?: Tables<"addresses">;
  onDone: () => void;
}) {
  const [state, formAction, pending] = useActionState(
    upsertAddress,
    initialState
  );

  useEffect(() => {
    if (state.success) onDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success]);

  return (
    <form
      action={formAction}
      className="mt-4 space-y-4 rounded-md border border-clay-200 bg-cream-100 p-5"
    >
      {address && (
        <input type="hidden" name="addressId" value={address.id} />
      )}
      <div className="space-y-1.5">
        <Label htmlFor="line1">Address</Label>
        <Input id="line1" name="line1" required defaultValue={address?.line1} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="line2">Apartment / floor (optional)</Label>
        <Input id="line2" name="line2" defaultValue={address?.line2 ?? ""} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="pincode">Pincode</Label>
          <Input
            id="pincode"
            name="pincode"
            required
            inputMode="numeric"
            defaultValue={address?.pincode}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="label">Label (optional)</Label>
          <Input
            id="label"
            name="label"
            placeholder="Home, Office…"
            defaultValue={address?.label ?? ""}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="contactName">Contact name</Label>
          <Input
            id="contactName"
            name="contactName"
            required
            defaultValue={address?.contact_name}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contactPhone">Phone</Label>
          <Input
            id="contactPhone"
            name="contactPhone"
            required
            inputMode="numeric"
            defaultValue={address?.contact_phone}
          />
        </div>
      </div>

      {state.error && <p className="text-sm text-alert-500">{state.error}</p>}

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={pending}
          className="h-10 rounded-md bg-pink-500 px-5 text-cream-50 hover:bg-pink-600"
        >
          {pending ? "Saving…" : "Save address"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onDone}
          className="h-10 rounded-md border-cocoa-700 px-5 text-cocoa-900 hover:bg-cream-50"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
