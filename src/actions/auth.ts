"use server";

import { AuthError, CredentialsSignin } from "next-auth";
import { redirect } from "next/navigation";

import { signIn, signOut } from "@/auth";
import { EMAIL_NOT_VERIFIED_CODE } from "@/auth.config";
import { getSafeCallbackUrl, SIGN_IN_PATH } from "@/lib/auth-redirect";
import { sendPasswordResetEmail } from "@/lib/email";
import { hashPassword } from "@/lib/password";
import {
  createPasswordResetToken,
  getResetPasswordUrl,
  RESET_LINK_ERRORS,
  resetPasswordWithToken,
  type ResetPasswordResult,
} from "@/lib/password-reset-tokens";
import { prisma } from "@/lib/prisma";
import {
  FORGOT_PASSWORD_SCHEMA,
  RESET_PASSWORD_SCHEMA,
  SIGN_IN_SCHEMA,
} from "@/lib/validations/auth";
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

export type ForgotPasswordResult = ActionResult;

// Always reports success for a valid email, so the form can't reveal which emails have accounts.
export async function requestPasswordReset(
  _prevState: ForgotPasswordResult,
  formData: FormData,
): Promise<ForgotPasswordResult> {
  const parsed = FORGOT_PASSWORD_SCHEMA.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { success: false, data: null, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { email } = parsed.data;
  try {
    const user = await prisma.user.findUnique({ where: { email }, select: { password: true } });
    // OAuth-only users have no password to reset.
    if (user?.password) {
      const token = await createPasswordResetToken(email);
      await sendPasswordResetEmail(email, getResetPasswordUrl(token));
    }
  } catch (error) {
    console.error("Password reset request failed:", error);
  }
  return { success: true, data: null, error: null };
}

// data.needsNewLink tells the form to offer a new link when the token is no longer usable.
export type ResetPasswordFormResult = ActionResult<{ needsNewLink: boolean }>;

export async function resetPassword(
  _prevState: ResetPasswordFormResult,
  formData: FormData,
): Promise<ResetPasswordFormResult> {
  const parsed = RESET_PASSWORD_SCHEMA.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { success: false, data: null, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  let result: ResetPasswordResult;
  try {
    result = await resetPasswordWithToken(parsed.data.token, await hashPassword(parsed.data.password));
  } catch (error) {
    console.error("Password reset failed:", error);
    return { success: false, data: null, error: "Something went wrong. Please try again." };
  }

  if (result !== "reset") {
    return { success: false, data: { needsNewLink: true }, error: RESET_LINK_ERRORS[result] };
  }
  redirect(`${SIGN_IN_PATH}?reset=1`);
}
