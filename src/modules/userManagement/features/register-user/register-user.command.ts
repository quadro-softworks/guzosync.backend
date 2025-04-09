// src/modules/user-management/features/register-user/register-user.command.ts
import { z } from 'zod';
import { Role } from '@core/domain/enums/role.enum';

export const RegisterUserSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address').trim().toLowerCase(),
    // Add password complexity requirements if needed
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    firstName: z
      .string()
      .min(2, 'First name must be at least 2 characters')
      .trim(),
    lastName: z
      .string()
      .min(2, 'Last name must be at least 2 characters')
      .trim(),
    phoneNumber: z
      .string()
      .min(7, 'Phone number must be at least 7 digits') // Adjust as needed
      .trim()
      .optional(),
    role: z.enum([Role.Passenger, Role.ControlCenter], {
      message:
        'You should either be a PASSENGER or a CONTROL_CENTER to register from this portal. If you are QUEUE_REGULATOR or BUS_DRIVER please contact control center.',
    }),
  }),
});

export type RegisterUserCommand = z.infer<typeof RegisterUserSchema>['body'];
