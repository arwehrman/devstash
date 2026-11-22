import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

export const CREDENTIALS_FIELDS = {
  email: { label: "Email", type: "email" },
  password: { label: "Password", type: "password" },
};

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
  callbacks: {
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      return session;
    },
  },
} satisfies NextAuthConfig;
