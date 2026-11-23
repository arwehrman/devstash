import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

import { SIGN_IN_PATH } from "@/lib/auth-redirect";

export const CREDENTIALS_FIELDS = {
  email: { label: "Email", type: "email" },
  password: { label: "Password", type: "password" },
};

// CredentialsSignin code for a correct password on an unverified email.
export const EMAIL_NOT_VERIFIED_CODE = "email_not_verified";
export const RATE_LIMITED_CODE = "rate_limited";

// Edge-safe config: no adapter or database access, so the proxy can use it.
// The Credentials provider is a placeholder; src/auth.ts replaces it with the real one.
export default {
  providers: [
    GitHub,
    Credentials({
      credentials: CREDENTIALS_FIELDS,
      authorize: () => null,
    }),
  ],
  // Custom pages; Auth.js sends sign-in and other errors here as ?error=<type>.
  pages: { signIn: SIGN_IN_PATH, error: SIGN_IN_PATH },
  callbacks: {
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      return session;
    },
  },
} satisfies NextAuthConfig;
