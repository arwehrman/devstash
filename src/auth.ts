import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import authConfig, {
  CREDENTIALS_FIELDS,
  EMAIL_NOT_VERIFIED_CODE,
  RATE_LIMITED_CODE,
} from "@/auth.config";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { SIGN_IN_SCHEMA } from "@/lib/validations/auth";
import { isEmailVerificationEnabled } from "@/lib/verification-tokens";

class EmailNotVerifiedError extends CredentialsSignin {
  code = EMAIL_NOT_VERIFIED_CODE;
}

class RateLimitedError extends CredentialsSignin {
  code = RATE_LIMITED_CODE;
}

const credentialsProvider = Credentials({
  credentials: CREDENTIALS_FIELDS,
  async authorize(credentials, request) {
    const parsed = SIGN_IN_SCHEMA.safeParse(credentials);
    if (!parsed.success) return null;

    // The sign-in action also limits (with a retry time), but direct POSTs to
    // /api/auth/callback/credentials skip the action, so check here too.
    const key = `${getClientIp(request.headers)}:${parsed.data.email}`;
    if (!(await checkRateLimit("signInCallback", key)).success) throw new RateLimitedError();

    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        password: true,
        emailVerified: true,
      },
    });
    // OAuth-only users have no password and can't sign in with credentials.
    if (!user?.password) return null;

    const valid = await bcrypt.compare(parsed.data.password, user.password);
    if (!valid) return null;
    // Checked after the password, so only the account owner learns it's unverified.
    if (!user.emailVerified && isEmailVerificationEnabled()) throw new EmailNotVerifiedError();

    return { id: user.id, name: user.name, email: user.email, image: user.image };
  },
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: authConfig.providers.map((provider) =>
    typeof provider !== "function" && provider.id === "credentials"
      ? credentialsProvider
      : provider,
  ),
});
