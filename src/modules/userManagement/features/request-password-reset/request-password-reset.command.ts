import { z } from 'zod';
export const RequestPasswordResetSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address').trim().toLowerCase(),
  }),
});
export type RequestPasswordResetCommand = z.infer<
  typeof RequestPasswordResetSchema
>['body'];
