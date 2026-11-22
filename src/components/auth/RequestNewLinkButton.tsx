import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export function RequestNewLinkButton() {
  return (
    <Link href="/forgot-password" className={buttonVariants({ className: "w-full" })}>
      Request a new link
    </Link>
  );
}
