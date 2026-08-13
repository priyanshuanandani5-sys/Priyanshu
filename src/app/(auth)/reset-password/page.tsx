"use client";

import { useActionState } from "react";
import { updatePassword, type AuthActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthActionState = { error: null };

export default function ResetPasswordPage() {
  const [state, formAction, pending] = useActionState(
    updatePassword,
    initialState
  );

  return (
    <div>
      <h1 className="font-display text-2xl text-cocoa-900">
        Set a new password
      </h1>
      <p className="mt-1 text-sm text-cocoa-700">
        Choose a new password for your account.
      </p>

      <form action={formAction} className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="password">New password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            minLength={8}
            required
            autoFocus
          />
          <p className="text-xs text-cocoa-700/70">At least 8 characters.</p>
        </div>

        {state.error && (
          <p className="text-sm text-alert-500">{state.error}</p>
        )}

        <Button
          type="submit"
          disabled={pending}
          className="h-11 w-full bg-pink-500 text-cream-50 hover:bg-pink-600"
        >
          {pending ? "Saving…" : "Save new password"}
        </Button>
      </form>
    </div>
  );
}
