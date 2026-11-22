import { z } from "zod";

const email = z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address"));

export const SIGN_IN_SCHEMA = z.object({
  email,
  password: z.string().min(1, "Password is required"),
});

export const REGISTER_SCHEMA = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(100),
    email,
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      // bcrypt only uses the first 72 bytes, and UTF-8 characters can take up to 4.
      .refine((value) => new TextEncoder().encode(value).length <= 72, {
        message: "Password is too long",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof REGISTER_SCHEMA>;
