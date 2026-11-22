import { prisma } from "@/lib/prisma";
import {
  createToken,
  getTokenUrl,
  hashToken,
  PASSWORD_RESET_PREFIX,
} from "@/lib/verification-tokens";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

type ResetLinkError = "invalid" | "expired";
export type ResetTokenStatus = "valid" | ResetLinkError;
export type ResetPasswordResult = "reset" | ResetLinkError;

export const RESET_LINK_ERRORS: Record<ResetLinkError, string> = {
  invalid: "This reset link is invalid or has already been used.",
  expired: "This reset link has expired.",
};

// Replaces any earlier reset link for this email and returns the raw token.
export function createPasswordResetToken(email: string): Promise<string> {
  return createToken(PASSWORD_RESET_PREFIX + email, RESET_TOKEN_TTL_MS);
}

export function getResetPasswordUrl(token: string): string {
  return getTokenUrl("/reset-password", token);
}

// Only tokens under the reset prefix count, so an email verification token is never accepted.
async function findResetToken(token: string) {
  const record = await prisma.verificationToken.findUnique({ where: { token: hashToken(token) } });
  if (!record?.identifier.startsWith(PASSWORD_RESET_PREFIX)) return null;
  return { ...record, email: record.identifier.slice(PASSWORD_RESET_PREFIX.length) };
}

// Checks a link without using it up, so the reset page can show the right message.
export async function getResetTokenStatus(token: string): Promise<ResetTokenStatus> {
  const record = await findResetToken(token);
  if (!record) return "invalid";
  return record.expires < new Date() ? "expired" : "valid";
}

export async function resetPasswordWithToken(
  token: string,
  passwordHash: string,
): Promise<ResetPasswordResult> {
  const record = await findResetToken(token);
  if (!record) return "invalid";

  if (record.expires < new Date()) {
    await prisma.verificationToken.deleteMany({ where: { token: record.token } });
    return "expired";
  }

  return prisma.$transaction(async (tx) => {
    // Deleting first means two requests with the same link can't both reset the password.
    const deleted = await tx.verificationToken.deleteMany({ where: { token: record.token } });
    if (deleted.count === 0) return "invalid";

    const updated = await tx.user.updateMany({
      where: { email: record.email, password: { not: null } },
      data: { password: passwordHash },
    });
    if (updated.count === 0) return "invalid";

    // Opening the emailed link proves they own the address.
    await tx.user.updateMany({
      where: { email: record.email, emailVerified: null },
      data: { emailVerified: new Date() },
    });
    return "reset";
  });
}
