import { Layers } from "lucide-react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { DEFAULT_REDIRECT } from "@/lib/auth-redirect";

export default async function AuthLayout({ children }: LayoutProps<"/">) {
  // Signed-in users have no reason to see the sign-in or register forms.
  const session = await auth();
  if (session?.user) redirect(DEFAULT_REDIRECT);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-12">
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-violet-600 text-white">
          <Layers className="size-4" />
        </div>
        <span className="text-lg font-semibold">DevStash</span>
      </div>
      <div className="w-full max-w-sm">{children}</div>
    </main>
  );
}
