export interface SidebarUser {
  name: string | null;
  email: string;
  image: string | null;
}

export interface ProfileUser extends SidebarUser {
  id: string;
  createdAt: Date;
  // False for OAuth-only accounts, which can't change a password.
  hasPassword: boolean;
}
