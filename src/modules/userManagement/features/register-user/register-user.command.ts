// src/modules/user-management/features/register-user/register-user.command.ts
import { z } from "zod";

export const RegisterUserSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address").trim().toLowerCase(),
    // Add password complexity requirements if needed
    password: z.string().min(8, "Password must be at least 8 characters long"),
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .trim()
      .optional(),
  }),
});

export type RegisterUserCommand = z.infer<typeof RegisterUserSchema>["body"];
