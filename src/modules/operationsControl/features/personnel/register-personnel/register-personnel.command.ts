import { Role } from '@core/domain/enums/role.enum';
import { z } from 'zod';

export const RegisterPersonnelCommandSchema = z.object({
  body: z.object({
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    role: z.enum([Role.BusDriver, Role.QueueRegulator]), // Example roles
    email: z.string().email(),
    phone: z.string().min(10).max(15),
  }),
});

export type RegisterPersonnelCommand = z.infer<
  typeof RegisterPersonnelCommandSchema
>['body'];
