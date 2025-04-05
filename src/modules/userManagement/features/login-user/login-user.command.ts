// src/modules/user-management/features/login-user/login-user.command.ts
import { AuthResult } from '@core/domain/dtos/auth-result.dto';
import { z } from 'zod';

export const LoginUserSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address').trim().toLowerCase(),
    password: z.string().min(1, 'Password cannot be empty'), // Basic check, actual length check during comparison
  }),
});

export type LoginUserCommand = z.infer<typeof LoginUserSchema>['body'];

// Define the expected response structure for login
export interface LoginResponse {
  token: string;

  user: AuthResult; // Return some user info along with the token
}
