"use client";

import { useActionState } from "react";

import { resetPassword, type ResetPasswordFormResult } from "@/actions/auth";
import { FormField } from "@/components/auth/FormField";
import { FormMessage } from "@/components/auth/FormMessage";
import { RequestNewLinkButton } from "@/components/auth/RequestNewLinkButton";
import { Button } from "@/components/ui/button";

interface ResetPasswordFormProps {
  token: string;
}

const INITIAL_STATE: ResetPasswordFormResult = { success: false, data: null, error: null };

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [state, formAction, pending] = useActionState(resetPassword, INITIAL_STATE);

  // The link stopped working while the form was open, so the form can't succeed any more.
  if (state.data?.needsNewLink) {
    return (
      <div className="flex flex-col gap-4">
        <FormMessage variant="error">{state.error}</FormMessage>
        <RequestNewLinkButton />
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error && <FormMessage variant="error">{state.error}</FormMessage>}
      <input type="hidden" name="token" value={token} />
      <FormField
        id="password"
        label="New password"
        type="password"
        autoComplete="new-password"
        minLength={8}
        required
      />
      <FormField
        id="confirmPassword"
        label="Confirm new password"
        type="password"
        autoComplete="new-password"
        required
      />
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Updating password…" : "Update password"}
      </Button>
    </form>
  );
}
