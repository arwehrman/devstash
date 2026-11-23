"use client";

import { useState } from "react";

import { FormMessage } from "@/components/auth/FormMessage";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/types/actions";

interface ResendVerificationButtonProps {
  email: string;
}

const SENT_MESSAGE = "If that account still needs verifying, we've sent a new link. Check your inbox.";

async function resendVerification(email: string): Promise<ActionResult> {
  try {
    const response = await fetch("/api/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return (await response.json()) as ActionResult;
  } catch {
    return { success: false, data: null, error: "Could not reach the server. Please try again." };
  }
}

export function ResendVerificationButton({ email }: ResendVerificationButtonProps) {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<ActionResult | null>(null);

  async function handleClick() {
    setPending(true);
    setResult(await resendVerification(email));
    setPending(false);
  }

  return (
    <div className="flex flex-col gap-2">
      {result && (
        <FormMessage variant={result.success ? "success" : "error"}>
          {result.success ? SENT_MESSAGE : (result.error ?? "Something went wrong. Please try again.")}
        </FormMessage>
      )}
      <Button type="button" variant="outline" disabled={pending} onClick={handleClick} className="w-full">
        {pending ? "Sending…" : "Resend verification email"}
      </Button>
    </div>
  );
}
