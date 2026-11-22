"use client";

import { useActionState } from "react";

import { deleteAccount, type DeleteAccountResult } from "@/actions/profile";
import { FormMessage } from "@/components/auth/FormMessage";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

const INITIAL_STATE: DeleteAccountResult = { success: false, data: null, error: null };

// Inside the dialog content, which unmounts on close, so an old error doesn't come back.
function DeleteAccountForm() {
  // On success the action signs out and redirects, so only errors come back here.
  const [state, formAction, pending] = useActionState(deleteAccount, INITIAL_STATE);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error && <FormMessage variant="error">{state.error}</FormMessage>}
      <AlertDialogFooter>
        <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
        <AlertDialogAction type="submit" variant="destructive" disabled={pending}>
          {pending ? "Deleting…" : "Delete account"}
        </AlertDialogAction>
      </AlertDialogFooter>
    </form>
  );
}

export function DeleteAccountDialog() {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="destructive" />}>
        Delete account
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete your account?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently deletes your account and all of your items, collections and tags.
            This can&apos;t be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <DeleteAccountForm />
      </AlertDialogContent>
    </AlertDialog>
  );
}
