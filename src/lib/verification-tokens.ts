import { createHash, randomBytes } from "node:crypto";

import { prisma } from "@/lib/prisma";

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

export type VerifyEmailResult = "verified" | "invalid" | "expired";

// Only the hash is stored, so a database leak doesn't expose usable links.
function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

// Replaces any earlier token for this email and returns the raw token for the link.
export async function createVerificationToken(email: string): Promise<string> {
  const token = randomBytes(32).toString("base64url");
  await prisma.$transaction([
    prisma.verificationToken.deleteMany({ where: { identifier: email } }),
    prisma.verificationToken.create({
      data: {
        identifier: email,
        token: hashToken(token),
        expires: new Date(Date.now() + TOKEN_TTL_MS),
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
  if (!record) return "invalid";

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
  const baseUrl = process.env.APP_URL;
  if (!baseUrl) throw new Error("APP_URL is not set");
  const url = new URL("/verify-email", baseUrl);
  url.searchParams.set("token", token);
  return url.toString();
}
