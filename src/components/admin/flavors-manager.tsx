"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FlavorForm } from "@/components/admin/flavor-form";
import { toggleFlavorAvailability, deleteFlavor } from "@/lib/actions/admin-catalog";
import type { Flavor } from "@/lib/data/flavors";

export function FlavorsManager({ flavors }: { flavors: Flavor[] }) {
  const [editingId, setEditingId] = useState<string | "new" | null>(null);

  return (
    <div>
      <div className="space-y-3">
        {flavors.map((flavor) =>
          editingId === flavor.id ? (
            <FlavorForm
              key={flavor.id}
              flavor={flavor}
              onDone={() => setEditingId(null)}
            />
          ) : (
            <div
              key={flavor.id}
              className="flex items-start justify-between gap-4 rounded-md border border-clay-200 bg-[#fffcf6] p-4"
            >
              <div>
                <p className="font-medium text-cocoa-900">
                  {flavor.name}
                  {!flavor.is_available && (
                    <span className="ml-2 rounded-full bg-alert-500/10 px-2 py-0.5 text-xs text-alert-500">
                      Unavailable
                    </span>
                  )}
                </p>
                {flavor.description && (
                  <p className="mt-1 text-sm text-cocoa-700">
                    {flavor.description}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2 text-sm">
                <button
                  onClick={() => setEditingId(flavor.id)}
                  className="text-pink-600 hover:text-pink-700"
                >
                  Edit
                </button>
                <form action={toggleFlavorAvailability}>
                  <input type="hidden" name="flavorId" value={flavor.id} />
                  <input
                    type="hidden"
                    name="isAvailable"
                    value={String(flavor.is_available)}
                  />
                  <button className="text-cocoa-700 hover:text-cocoa-900">
                    {flavor.is_available ? "Mark unavailable" : "Mark available"}
                  </button>
                </form>
                <form action={deleteFlavor}>
                  <input type="hidden" name="flavorId" value={flavor.id} />
                  <button className="text-cocoa-700/60 hover:text-alert-500">
                    Delete
                  </button>
                </form>
              </div>
            </div>
          )
        )}
      </div>

      <div className="mt-4">
        {editingId === "new" ? (
          <FlavorForm onDone={() => setEditingId(null)} />
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={() => setEditingId("new")}
            className="h-10 rounded-md border-cocoa-700 text-cocoa-900 hover:bg-cream-100"
          >
            <Plus className="h-4 w-4" /> Add flavor
          </Button>
        )}
      </div>
    </div>
  );
}
