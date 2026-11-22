import type { Metadata } from "next";
import Link from "next/link";

import { FormMessage } from "@/components/auth/FormMessage";
import { GitHubSignInButton } from "@/components/auth/GitHubSignInButton";
import { SignInForm } from "@/components/auth/SignInForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAuthErrorMessage, getSafeCallbackUrl } from "@/lib/auth-redirect";
import { isEmailVerificationEnabled } from "@/lib/verification-tokens";

export const metadata: Metadata = { title: "Sign in · Devstash" };

export default async function SignInPage({ searchParams }: PageProps<"/sign-in">) {
  const { callbackUrl, error, registered, verified, reset, deleted } = await searchParams;
  const safeCallbackUrl = getSafeCallbackUrl(callbackUrl);
  const errorMessage = getAuthErrorMessage(error);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Welcome back. Sign in to your stash.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {registered === "1" && (
          <FormMessage variant="success">
            {isEmailVerificationEnabled()
              ? "Account created. Check your email for a link to verify your address, then sign in."
              : "Account created. You can sign in now."}
          </FormMessage>
        )}
        {verified === "1" && (
          <FormMessage variant="success">Email verified. You can sign in now.</FormMessage>
        )}
        {reset === "1" && (
          <FormMessage variant="success">Password updated. Sign in with your new password.</FormMessage>
        )}
        {deleted === "1" && (
          <FormMessage variant="success">Your account has been deleted.</FormMessage>
        )}
        {errorMessage &&<FormMessage variant="error">{errorMessage}</FormMessage>}
        <GitHubSignInButton callbackUrl={safeCallbackUrl} />
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          or
          <span className="h-px flex-1 bg-border" />
        </div>
        <SignInForm callbackUrl={safeCallbackUrl} />
      </CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">
        Don&apos;t have an account?
        <Link href="/register" className="ml-1 text-foreground underline-offset-4 hover:underline">
          Register
        </Link>
      </CardFooter>
    </Card>
  );
}
