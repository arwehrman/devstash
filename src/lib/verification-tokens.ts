import { createHash, randomBytes } from "node:crypto";

import { prisma } from "@/lib/prisma";

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

export type VerifyEmailResult = "verified" | "invalid" | "expired";

// On unless EMAIL_VERIFICATION_ENABLED is exactly "false", so a missing var never disables it.
export function isEmailVerificationEnabled(): boolean {
  return process.env.EMAIL_VERIFICATION_ENABLED !== "false";
}

// Password reset tokens share the VerificationToken table, under a prefixed identifier.
export const PASSWORD_RESET_PREFIX = "password-reset:";

// Only the hash is stored, so a database leak doesn't expose usable links.
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

// Replaces any earlier verification token for this email and returns the raw token for the link.
export async function createVerificationToken(email: string): Promise<string> {
  return createToken(email, TOKEN_TTL_MS);
}

// Stores a new token for this identifier, replacing any earlier one, and returns the raw token.
export async function createToken(identifier: string, ttlMs: number): Promise<string> {
  const token = randomBytes(32).toString("base64url");
  await prisma.$transaction([
    prisma.verificationToken.deleteMany({ where: { identifier } }),
    prisma.verificationToken.create({
      data: {
        identifier,
        token: hashToken(token),
        expires: new Date(Date.now() + ttlMs),
      },
    }),
  ]);
  return token;
}

// True while an unexpired verification link exists for this email.
export async function hasPendingVerification(email: string): Promise<boolean> {
  const count = await prisma.verificationToken.count({
    where: { identifier: email, expires: { gt: new Date() } },
  });
  return count > 0;
}

export async function verifyEmailToken(token: string): Promise<VerifyEmailResult> {
  const record = await prisma.verificationToken.findUnique({
    where: { token: hashToken(token) },
  });
  // A password reset token must never verify an email.
  if (!record || record.identifier.startsWith(PASSWORD_RESET_PREFIX)) return "invalid";

  if (record.expires < new Date()) {
    await prisma.verificationToken.deleteMany({ where: { token: record.token } });
    return "expired";
  }

  const [updated] = await prisma.$transaction([
    prisma.user.updateMany({
      where: { email: record.identifier },
      data: { emailVerified: new Date() },
    }),
    prisma.verificationToken.deleteMany({ where: { token: record.token } }),
  ]);
  return updated.count > 0 ? "verified" : "invalid";
}

export function getVerifyUrl(token: string): string {
  return getTokenUrl("/verify-email", token);
}

export function getTokenUrl(path: string, token: string): string {
  const baseUrl = process.env.APP_URL;
  if (!baseUrl) throw new Error("APP_URL is not set");
  const url = new URL(path, baseUrl);
  url.searchParams.set("token", token);
  return url.toString();
}
