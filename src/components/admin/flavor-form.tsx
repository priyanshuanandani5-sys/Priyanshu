"use client";

import { useActionState, useEffect } from "react";
import { upsertFlavor, type ActionState } from "@/lib/actions/admin-catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Flavor } from "@/lib/data/flavors";

const initialState: ActionState = { error: null };

export function FlavorForm({
  flavor,
  onDone,
}: {
  flavor?: Flavor;
  onDone: () => void;
}) {
  const [state, formAction, pending] = useActionState(upsertFlavor, initialState);

  useEffect(() => {
    if (state.success) onDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success]);

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-md border border-clay-200 bg-cream-100 p-5"
    >
      {flavor && <input type="hidden" name="flavorId" value={flavor.id} />}
      <div className="space-y-1.5">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required defaultValue={flavor?.name} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={2}
          defaultValue={flavor?.description ?? ""}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="sortOrder">Sort order</Label>
        <Input
          id="sortOrder"
          name="sortOrder"
          type="number"
          defaultValue={flavor?.sort_order ?? 0}
          className="w-24"
        />
      </div>

      {state.error && <p className="text-sm text-alert-500">{state.error}</p>}

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={pending}
          className="h-10 rounded-md bg-pink-500 px-5 text-cream-50 hover:bg-pink-600"
        >
          {pending ? "Saving…" : "Save flavor"}
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
