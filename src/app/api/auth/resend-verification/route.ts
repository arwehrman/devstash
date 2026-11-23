import { NextResponse } from "next/server";

import { sendVerificationEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";
import { RESEND_VERIFICATION_SCHEMA } from "@/lib/validations/auth";
import {
  createVerificationToken,
  getVerifyUrl,
  isEmailVerificationEnabled,
} from "@/lib/verification-tokens";

function errorResponse(error: string, status: number) {
  return NextResponse.json({ success: false, data: null, error }, { status });
}

// Always reports success for a valid email, so it can't reveal which emails have accounts.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid JSON body", 400);
  }

  const parsed = RESEND_VERIFICATION_SCHEMA.safeParse(body);
  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0]?.message ?? "Invalid input", 400);
  }

  const { email } = parsed.data;
  const rateLimit = await checkRateLimit("resendVerification", `${getClientIp(request.headers)}:${email}`);
  if (!rateLimit.success) return rateLimitResponse(rateLimit.reset);

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { password: true, emailVerified: true },
    });
    // Only unverified email/password accounts need a link; OAuth users are verified by GitHub.
    if (isEmailVerificationEnabled() && user?.password && !user.emailVerified) {
      // Replaces the earlier link, so only the newest one works.
      const token = await createVerificationToken(email);
      await sendVerificationEmail(email, getVerifyUrl(token));
    }
  } catch (error) {
    console.error("Resend verification failed:", error);
  }
  return NextResponse.json({ success: true, data: null, error: null });
}
