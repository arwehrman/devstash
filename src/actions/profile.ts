"use server";

import { auth, signOut } from "@/auth";
import { SIGN_IN_PATH } from "@/lib/auth-redirect";
import { hashPassword, verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { CHANGE_PASSWORD_SCHEMA } from "@/lib/validations/auth";
import { PASSWORD_RESET_PREFIX } from "@/lib/verification-tokens";
import type { ActionResult } from "@/types/actions";

const GENERIC_ERROR = "Something went wrong. Please try again.";
const SIGNED_OUT_ERROR = "Your session has ended. Please sign in again.";

export type ChangePasswordResult = ActionResult;

export async function changePassword(
  _prevState: ChangePasswordResult,
  formData: FormData,
): Promise<ChangePasswordResult> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { success: false, data: null, error: SIGNED_OUT_ERROR };

  const parsed = CHANGE_PASSWORD_SCHEMA.safeParse({
    currentPassword: formData.get("currentPassword"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { success: false, data: null, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, password: true },
    });
    // OAuth-only accounts have no password to change.
    if (!user?.password) {
      return { success: false, data: null, error: "This account doesn't use a password." };
    }

    const valid = await verifyPassword(parsed.data.currentPassword, user.password);
    if (!valid) return { success: false, data: null, error: "Current password is incorrect" };

    const passwordHash = await hashPassword(parsed.data.password);
    await prisma.$transaction([
      prisma.user.update({ where: { id: userId }, data: { password: passwordHash } }),
      // A reset link requested before the change shouldn't still work afterwards.
      prisma.verificationToken.deleteMany({
        where: { identifier: PASSWORD_RESET_PREFIX + user.email },
      }),
    ]);
    return { success: true, data: null, error: null };
  } catch (error) {
    console.error("Change password failed:", error);
    return { success: false, data: null, error: GENERIC_ERROR };
  }
}

export type DeleteAccountResult = ActionResult;

// Used with useActionState, which also passes the previous state; it isn't needed here.
export async function deleteAccount(): Promise<DeleteAccountResult> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { success: false, data: null, error: SIGNED_OUT_ERROR };

  try {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
    if (!user) return { success: false, data: null, error: SIGNED_OUT_ERROR };

    await prisma.$transaction([
      // Verification and reset tokens aren't linked to the user, so the cascade doesn't remove them.
      prisma.verificationToken.deleteMany({
        where: { identifier: { in: [user.email, PASSWORD_RESET_PREFIX + user.email] } },
      }),
      // Items go first: Item.typeId is ON DELETE RESTRICT, so this avoids relying on the
      // cascade removing items before the user's custom item types.
      prisma.item.deleteMany({ where: { userId } }),
      // Collections, tags, custom types, accounts and sessions cascade.
      prisma.user.delete({ where: { id: userId } }),
    ]);
  } catch (error) {
    console.error("Delete account failed:", error);
    return { success: false, data: null, error: GENERIC_ERROR };
  }

  // Redirects, so nothing after this runs.
  await signOut({ redirectTo: `${SIGN_IN_PATH}?deleted=1` });
  return { success: true, data: null, error: null };
}
