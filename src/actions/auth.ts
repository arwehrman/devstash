"use server";

import { AuthError, CredentialsSignin } from "next-auth";

import { signIn, signOut } from "@/auth";
import { EMAIL_NOT_VERIFIED_CODE } from "@/auth.config";
import { getSafeCallbackUrl, SIGN_IN_PATH } from "@/lib/auth-redirect";
import { SIGN_IN_SCHEMA } from "@/lib/validations/auth";
import type { ActionResult } from "@/types/actions";

// data.email lets the form refill the email after React resets it on a failed attempt.
export type SignInResult = ActionResult<{ email: string }>;

function getCredentialsErrorMessage(error: AuthError): string {
  if (error instanceof CredentialsSignin) {
    return error.code === EMAIL_NOT_VERIFIED_CODE
      ? "Please verify your email first. Check your inbox for the verification link."
      : "Invalid email or password";
  }
  return "Something went wrong. Please try again.";
}

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
    return { success: false, data, error: getCredentialsErrorMessage(error) };
  }
}

export async function signInWithGitHub(formData: FormData) {
  await signIn("github", { redirectTo: getSafeCallbackUrl(formData.get("callbackUrl")) });
}

export async function signOutUser() {
  await signOut({ redirectTo: SIGN_IN_PATH });
}
