"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordReset, type AuthActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthActionState = { error: null };

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(
    requestPasswordReset,
    initialState
  );

  return (
    <div>
      <h1 className="font-display text-2xl text-cocoa-900">
        Reset your password
      </h1>
      <p className="mt-1 text-sm text-cocoa-700">
        We&apos;ll email you a link to set a new password.
      </p>

      <form action={formAction} className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required autoFocus />
        </div>

        {state.error && (
          <p className="text-sm text-alert-500">{state.error}</p>
        )}

        <Button
          type="submit"
          disabled={pending}
          className="h-11 w-full bg-pink-500 text-cream-50 hover:bg-pink-600"
        >
          {pending ? "Sending…" : "Send reset link"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-cocoa-700">
        <Link
          href="/login"
          className="text-pink-600 hover:text-pink-700"
        >
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
