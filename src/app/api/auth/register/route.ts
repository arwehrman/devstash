import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Prisma } from "@/generated/prisma/client";
import { sendVerificationEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { REGISTER_SCHEMA } from "@/lib/validations/auth";
import {
  createVerificationToken,
  getVerifyUrl,
  hasPendingVerification,
} from "@/lib/verification-tokens";

const BCRYPT_ROUNDS = 12;

const EMAIL_TAKEN = "An account with this email already exists";
const VERIFICATION_PENDING =
  "We already sent a verification link to this email. Check your inbox, or try again after it expires.";

function errorResponse(error: string, status: number) {
  return NextResponse.json({ success: false, data: null, error }, { status });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid JSON body", 400);
  }

  const parsed = REGISTER_SCHEMA.safeParse(body);
  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0]?.message ?? "Invalid input", 400);
  }

  const { name, email, password } = parsed.data;

  try {
    const existing = await prisma.user.findUnique({
      where: { email },
      select: { id: true, password: true, emailVerified: true },
    });
    if (existing) {
      // A never-verified email/password account can't be signed in to, so registering
      // again replaces it once its link has expired or been used. While a link is still
      // pending, replacing it would let someone else take over the sign-up.
      const unverified = existing.password && !existing.emailVerified;
      if (!unverified) return errorResponse(EMAIL_TAKEN, 409);
      if (await hasPendingVerification(email)) return errorResponse(VERIFICATION_PENDING, 409);
      await prisma.$transaction([
        prisma.verificationToken.deleteMany({ where: { identifier: email } }),
        prisma.user.delete({ where: { id: existing.id } }),
      ]);
    }

    const user = await prisma.user.create({
      data: { name, email, password: await bcrypt.hash(password, BCRYPT_ROUNDS) },
      select: { id: true, name: true, email: true },
    });

    try {
      const token = await createVerificationToken(user.email);
      await sendVerificationEmail(user.email, getVerifyUrl(token));
    } catch (error) {
      // Without the email the account can't be verified, so remove it and let them retry.
      console.error("Verification email failed:", error);
      await prisma.user.delete({ where: { id: user.id } });
      await prisma.verificationToken.deleteMany({ where: { identifier: user.email } });
      return errorResponse("We couldn't send the verification email. Please try again.", 500);
    }

    return NextResponse.json({ success: true, data: user, error: null }, { status: 201 });
  } catch (error) {
    // A concurrent request created the same email between the check and the insert.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return errorResponse(EMAIL_TAKEN, 409);
    }
    console.error("Registration failed:", error);
    return errorResponse("Something went wrong. Please try again.", 500);
  }
}
