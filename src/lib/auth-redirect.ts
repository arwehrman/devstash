export const SIGN_IN_PATH = "/sign-in";
export const DEFAULT_REDIRECT = "/dashboard";

// Only same-site paths, so a crafted callbackUrl can't send users to another site.
export function getSafeCallbackUrl(value: unknown): string {
  if (typeof value !== "string") return DEFAULT_REDIRECT;
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return DEFAULT_REDIRECT;
  }
  return value;
}

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  OAuthAccountNotLinked:
    "An account with this email already exists. Sign in with your email and password.",
  AccessDenied: "Access was denied. Please try again.",
  VerificationInvalid: "This verification link is invalid or has already been used.",
  VerificationExpired: "This verification link has expired. Please register again.",
};

export function getAuthErrorMessage(error: unknown): string | null {
  if (typeof error !== "string" || !error) return null;
  return AUTH_ERROR_MESSAGES[error] ?? "Sign in failed. Please try again.";
}
