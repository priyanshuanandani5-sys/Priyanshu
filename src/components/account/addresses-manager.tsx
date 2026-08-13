"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddressForm } from "@/components/account/address-form";
import { deleteAddress, setDefaultAddress } from "@/lib/actions/account";
import type { Tables } from "@/lib/types/database.types";

type Address = Tables<"addresses">;

const AREA_LABELS: Record<string, string> = {
  vile_parle: "Vile Parle",
  juhu: "Juhu",
};

export function AddressesManager({ addresses }: { addresses: Address[] }) {
  const [editingId, setEditingId] = useState<string | "new" | null>(null);

  return (
    <div>
      {addresses.length === 0 && editingId !== "new" && (
        <p className="text-cocoa-700">No saved addresses yet.</p>
      )}

      <div className="space-y-4">
        {addresses.map((addr) =>
          editingId === addr.id ? (
            <AddressForm
              key={addr.id}
              address={addr}
              onDone={() => setEditingId(null)}
            />
          ) : (
            <div
              key={addr.id}
              className="rounded-md border border-clay-200 bg-[#fffcf6] p-5 shadow-[0_2px_12px_rgba(74,46,35,0.08)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-cocoa-900">
                    {addr.label || AREA_LABELS[addr.area]}
                    {addr.is_default && (
                      <span className="ml-2 rounded-full bg-sage-500/15 px-2 py-0.5 text-xs text-sage-600">
                        Default
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-sm text-cocoa-700">
                    {addr.line1}
                    {addr.line2 ? `, ${addr.line2}` : ""} —{" "}
                    {AREA_LABELS[addr.area]} {addr.pincode}
                  </p>
                  <p className="mt-1 text-sm text-cocoa-700/70">
                    {addr.contact_name} · {addr.contact_phone}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2 text-sm">
                  <button
                    onClick={() => setEditingId(addr.id)}
                    className="text-pink-600 hover:text-pink-700"
                  >
                    Edit
                  </button>
                  {!addr.is_default && (
                    <form action={setDefaultAddress}>
                      <input type="hidden" name="addressId" value={addr.id} />
                      <button className="text-cocoa-700 hover:text-cocoa-900">
                        Set default
                      </button>
                    </form>
                  )}
                  <form action={deleteAddress}>
                    <input type="hidden" name="addressId" value={addr.id} />
                    <button className="text-cocoa-700/60 hover:text-alert-500">
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {editingId === "new" ? (
        <AddressForm onDone={() => setEditingId(null)} />
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={() => setEditingId("new")}
          className="mt-4 h-10 rounded-md border-cocoa-700 text-cocoa-900 hover:bg-cream-100"
        >
          <Plus className="h-4 w-4" /> Add new address
        </Button>
      )}
    </div>
  );
}
