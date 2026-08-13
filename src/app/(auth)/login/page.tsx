"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signIn, type AuthActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthActionState = { error: null };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    <div>
      <h1 className="font-display text-2xl text-cocoa-900">Welcome back</h1>
      <p className="mt-1 text-sm text-cocoa-700">
        Sign in to track orders and manage your addresses.
      </p>

      <form action={formAction} className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required autoFocus />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-xs text-pink-600 hover:text-pink-700"
            >
              Forgot password?
            </Link>
          </div>
          <Input id="password" name="password" type="password" required />
        </div>

        {state.error && (
          <p className="text-sm text-alert-500">{state.error}</p>
        )}

        <Button
          type="submit"
          disabled={pending}
          className="h-11 w-full bg-pink-500 text-cream-50 hover:bg-pink-600"
        >
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-cocoa-700">
        New here?{" "}
        <Link
          href="/sign-up"
          className="text-pink-600 hover:text-pink-700"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
