import type { Metadata } from "next";
import Link from "next/link";

import { FormMessage } from "@/components/auth/FormMessage";
import { RequestNewLinkButton } from "@/components/auth/RequestNewLinkButton";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SIGN_IN_PATH } from "@/lib/auth-redirect";
import {
  getResetTokenStatus,
  RESET_LINK_ERRORS,
  type ResetTokenStatus,
} from "@/lib/password-reset-tokens";

// no-referrer keeps the token in the URL from leaking to other sites.
export const metadata: Metadata = { title: "Reset password · Devstash", referrer: "no-referrer" };

export default async function ResetPasswordPage({ searchParams }: PageProps<"/reset-password">) {
  const { token } = await searchParams;
  const resetToken = typeof token === "string" ? token : "";
  const status: ResetTokenStatus = resetToken ? await getResetTokenStatus(resetToken) : "invalid";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reset password</CardTitle>
        <CardDescription>Choose a new password for your account.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {status === "valid" ? (
          <ResetPasswordForm token={resetToken} />
        ) : (
          <>
            <FormMessage variant="error">{RESET_LINK_ERRORS[status]}</FormMessage>
            <RequestNewLinkButton />
          </>
        )}
      </CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">
        <Link href={SIGN_IN_PATH} className="text-foreground underline-offset-4 hover:underline">
          Back to sign in
        </Link>
      </CardFooter>
    </Card>
  );
}
