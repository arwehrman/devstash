import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import authConfig, { CREDENTIALS_FIELDS } from "@/auth.config";
import { prisma } from "@/lib/prisma";
import { SIGN_IN_SCHEMA } from "@/lib/validations/auth";

const credentialsProvider = Credentials({
  credentials: CREDENTIALS_FIELDS,
  async authorize(credentials) {
    const parsed = SIGN_IN_SCHEMA.safeParse(credentials);
    if (!parsed.success) return null;

    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email },
      select: { id: true, name: true, email: true, image: true, password: true },
    });
    // OAuth-only users have no password and can't sign in with credentials.
    if (!user?.password) return null;

    const valid = await bcrypt.compare(parsed.data.password, user.password);
    if (!valid) return null;

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
