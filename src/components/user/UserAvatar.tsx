import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  name: string | null;
  email?: string | null;
  image: string | null;
  size?: React.ComponentProps<typeof Avatar>["size"];
  className?: string;
}

// "Brad Traversy" → "BT", "Cher" → "C"; falls back to the email's first letter.
function getInitials(name: string | null, email?: string | null): string {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return (email?.[0] ?? "?").toUpperCase();

  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return `${first}${last}`.toUpperCase();
}

// Decorative: always shown next to the user's name, so screen readers skip it.
export function UserAvatar({ name, email, image, size, className }: UserAvatarProps) {
  return (
    <Avatar size={size} className={className} aria-hidden>
      {image && <AvatarImage src={image} alt="" />}
      <AvatarFallback>{getInitials(name, email)}</AvatarFallback>
    </Avatar>
  );
}
