import { z } from 'zod';
export const ConfirmPasswordResetSchema = z.object({
  // Token might come from URL param or body - adjust as needed
  // Let's assume body for now for simplicity
  body: z.object({
    token: z.string().min(1, 'Reset token is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters long'),
  }),
  // If token is in URL param:
  // params: z.object({ token: z.string().min(1) })
});
export type ConfirmPasswordResetCommand = z.infer<
  typeof ConfirmPasswordResetSchema
>['body'];
// Or combine body/params if needed
