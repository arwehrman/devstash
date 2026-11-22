"use client";

import { useActionState } from "react";

import { changePassword, type ChangePasswordResult } from "@/actions/profile";
import { FormField } from "@/components/auth/FormField";
import { FormMessage } from "@/components/auth/FormMessage";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const INITIAL_STATE: ChangePasswordResult = { success: false, data: null, error: null };

interface ChangePasswordDialogProps {
  email: string;
}

// Lives inside the dialog content, which unmounts on close, so each opening starts fresh.
function ChangePasswordForm({ email }: ChangePasswordDialogProps) {
  const [state, formAction, pending] = useActionState(changePassword, INITIAL_STATE);

  if (state.success) {
    return (
      <>
        <FormMessage variant="success">Password updated.</FormMessage>
        <DialogFooter>
          <DialogClose render={<Button />}>Done</DialogClose>
        </DialogFooter>
      </>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error && <FormMessage variant="error">{state.error}</FormMessage>}
      {/* Hidden, so password managers save the new password against the right account. */}
      <input type="email" name="username" autoComplete="username" value={email} readOnly hidden />
      <FormField
        id="currentPassword"
        label="Current password"
        type="password"
        autoComplete="current-password"
        required
      />
      <FormField
        id="password"
        label="New password"
        type="password"
        autoComplete="new-password"
        minLength={8}
        required
      />
      <FormField
        id="confirmPassword"
        label="Confirm new password"
        type="password"
        autoComplete="new-password"
        required
      />
      <DialogFooter>
        <DialogClose render={<Button variant="outline" type="button" />}>Cancel</DialogClose>
        <Button type="submit" disabled={pending}>
          {pending ? "Updating…" : "Update password"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function ChangePasswordDialog({ email }: ChangePasswordDialogProps) {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>Change password</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change password</DialogTitle>
          <DialogDescription>Enter your current password, then choose a new one.</DialogDescription>
        </DialogHeader>
        <ChangePasswordForm email={email} />
      </DialogContent>
    </Dialog>
  );
}
