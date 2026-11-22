"use client";

import { useActionState } from "react";

import { requestPasswordReset, type ForgotPasswordResult } from "@/actions/auth";
import { FormField } from "@/components/auth/FormField";
import { FormMessage } from "@/components/auth/FormMessage";
import { Button } from "@/components/ui/button";

const INITIAL_STATE: ForgotPasswordResult = { success: false, data: null, error: null };

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, INITIAL_STATE);

  if (state.success) {
    return (
      <FormMessage variant="success">
        If an account exists for that email, we&apos;ve sent a link to reset your password. The
        link expires in 1 hour.
      </FormMessage>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error && <FormMessage variant="error">{state.error}</FormMessage>}
      <FormField
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        required
      />
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Sending link…" : "Send reset link"}
      </Button>
    </form>
  );
}
