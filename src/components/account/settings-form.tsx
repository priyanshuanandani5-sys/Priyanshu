"use client";

import { useActionState } from "react";
import { updateProfile, type ActionState } from "@/lib/actions/account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: ActionState = { error: null };

export function SettingsForm({
  fullName,
  phone,
  email,
}: {
  fullName: string | null;
  phone: string | null;
  email: string;
}) {
  const [state, formAction, pending] = useActionState(
    updateProfile,
    initialState
  );

  return (
    <form action={formAction} className="mt-6 max-w-md space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" value={email} disabled />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="fullName">Full name</Label>
        <Input id="fullName" name="fullName" defaultValue={fullName ?? ""} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" defaultValue={phone ?? ""} />
      </div>

      {state.error && <p className="text-sm text-alert-500">{state.error}</p>}
      {state.success && (
        <p className="text-sm text-sage-600">Saved.</p>
      )}

      <Button
        type="submit"
        disabled={pending}
        className="h-11 rounded-md bg-pink-500 px-6 text-cream-50 hover:bg-pink-600"
      >
        {pending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
