"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { FormField } from "@/components/auth/FormField";
import { FormMessage } from "@/components/auth/FormMessage";
import { Button } from "@/components/ui/button";
import { SIGN_IN_PATH } from "@/lib/auth-redirect";
import { REGISTER_SCHEMA, type RegisterInput } from "@/lib/validations/auth";
import type { ActionResult } from "@/types/actions";

type FieldErrors = Partial<Record<keyof RegisterInput, string>>;

async function registerUser(input: RegisterInput): Promise<ActionResult> {
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    return (await response.json()) as ActionResult;
  } catch {
    return { success: false, data: null, error: "Could not reach the server. Please try again." };
  }
}

export function RegisterForm() {
  const router = useRouter();
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const parsed = REGISTER_SCHEMA.safeParse(Object.fromEntries(new FormData(event.currentTarget)));
    if (!parsed.success) {
      const { fieldErrors: errors } = z.flattenError(parsed.error);
      setFieldErrors(
        Object.fromEntries(Object.entries(errors).map(([key, messages]) => [key, messages?.[0]])),
      );
      return;
    }

    setFieldErrors({});
    setPending(true);
    const result = await registerUser(parsed.data);
    if (result.success) {
      router.push(`${SIGN_IN_PATH}?registered=1`);
      return;
    }
    setFormError(result.error ?? "Registration failed. Please try again.");
    setPending(false);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {formError && <FormMessage variant="error">{formError}</FormMessage>}
      <FormField id="name" label="Name" autoComplete="name" error={fieldErrors.name} />
      <FormField
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        error={fieldErrors.email}
      />
      <FormField
        id="password"
        label="Password"
        type="password"
        autoComplete="new-password"
        error={fieldErrors.password}
      />
      <FormField
        id="confirmPassword"
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        error={fieldErrors.confirmPassword}
      />
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
