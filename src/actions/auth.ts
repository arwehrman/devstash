"use server";

import { AuthError } from "next-auth";

import { signIn, signOut } from "@/auth";
import { getSafeCallbackUrl, SIGN_IN_PATH } from "@/lib/auth-redirect";
import { SIGN_IN_SCHEMA } from "@/lib/validations/auth";
import type { ActionResult } from "@/types/actions";

// data.email lets the form refill the email after React resets it on a failed attempt.
export type SignInResult = ActionResult<{ email: string }>;

export async function signInWithCredentials(
  _prevState: SignInResult,
  formData: FormData,
): Promise<SignInResult> {
  const rawEmail = formData.get("email");
  const data = { email: typeof rawEmail === "string" ? rawEmail : "" };

  const parsed = SIGN_IN_SCHEMA.safeParse({ email: rawEmail, password: formData.get("password") });
  if (!parsed.success) {
    return { success: false, data, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    // Redirects on success, so nothing after this runs.
    await signIn("credentials", {
      ...parsed.data,
      redirectTo: getSafeCallbackUrl(formData.get("callbackUrl")),
    });
    return { success: true, data, error: null };
  } catch (error) {
    // Anything that isn't an AuthError (including Next's redirect) must be rethrown.
    if (!(error instanceof AuthError)) throw error;
    const message =
      error.type === "CredentialsSignin"
        ? "Invalid email or password"
        : "Something went wrong. Please try again.";
    return { success: false, data, error: message };
  }
}

export async function signInWithGitHub(formData: FormData) {
  await signIn("github", { redirectTo: getSafeCallbackUrl(formData.get("callbackUrl")) });
}

export async function signOutUser() {
  await signOut({ redirectTo: SIGN_IN_PATH });
}
