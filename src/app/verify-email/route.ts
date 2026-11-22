import { NextResponse, type NextRequest } from "next/server";

import { SIGN_IN_PATH } from "@/lib/auth-redirect";
import { verifyEmailToken, type VerifyEmailResult } from "@/lib/verification-tokens";

const RESULT_PARAMS: Record<VerifyEmailResult, [string, string]> = {
  verified: ["verified", "1"],
  invalid: ["error", "VerificationInvalid"],
  expired: ["error", "VerificationExpired"],
};

// The link in the verification email lands here, then redirects to sign-in with the result.
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  let result: VerifyEmailResult = "invalid";

  if (token) {
    try {
      result = await verifyEmailToken(token);
    } catch (error) {
      console.error("Email verification failed:", error);
    }
  }

  const [key, value] = RESULT_PARAMS[result];
  const signInUrl = new URL(SIGN_IN_PATH, request.nextUrl.origin);
  signInUrl.searchParams.set(key, value);
  return NextResponse.redirect(signInUrl);
}
