"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { signInWithCredentials, type SignInResult } from "@/actions/auth";
import { FormField } from "@/components/auth/FormField";
import { FormMessage } from "@/components/auth/FormMessage";
import { ResendVerificationButton } from "@/components/auth/ResendVerificationButton";
import { Button } from "@/components/ui/button";

interface SignInFormProps {
  callbackUrl: string;
}

const INITIAL_STATE: SignInResult = { success: false, data: null, error: null };

export function SignInForm({ callbackUrl }: SignInFormProps) {
  const [state, formAction, pending] = useActionState(signInWithCredentials, INITIAL_STATE);
  // Remounts the resend button on each attempt, so an earlier "sent" message doesn't linger.
  const [attempt, setAttempt] = useState(0);

  return (
    <form
      action={formAction}
      onSubmit={() => setAttempt((count) => count + 1)}
      className="flex flex-col gap-4"
    >
      {state.error && <FormMessage variant="error">{state.error}</FormMessage>}
      {state.data?.needsVerification && (
        <ResendVerificationButton key={attempt} email={state.data.email} />
      )}
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <FormField
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        defaultValue={state.data?.email}
        required
      />
      <FormField
        id="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        labelAction={
          <Link
            href="/forgot-password"
            className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Forgot password?
          </Link>
        }
        required
      />
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
