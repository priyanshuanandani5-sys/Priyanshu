"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUp, type AuthActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthActionState = { error: null };

export default function SignUpPage() {
  const [state, formAction, pending] = useActionState(signUp, initialState);

  return (
    <div>
      <h1 className="font-display text-2xl text-cocoa-900">
        Create your account
      </h1>
      <p className="mt-1 text-sm text-cocoa-700">
        Save addresses, track orders, and check out faster.
      </p>

      <form action={formAction} className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" name="fullName" required autoFocus />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            minLength={8}
            required
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
          {pending ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-cocoa-700">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-pink-600 hover:text-pink-700"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
