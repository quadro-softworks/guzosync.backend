import { BusType } from '@core/domain/enums/bus-type.enum';
import { DefaultBusCapacity } from '@core/domain/models/bus.model';
import { z } from 'zod';

export const RegisterBusCommandSchema = z.object({
  licensePlate: z
    .string()
    .min(6, 'Minimum length is 6 characters')
    .max(6, 'Maximum length is 6 characters')
    .regex(
      /^[A-Z]{1}[0-9]{5}$/,
      'Invalid Licence Plate. Valid Example: A12345, B12345, etc.',
    ),
  busType: z.nativeEnum(BusType),
  capacity: z.number().int().positive().optional().default(DefaultBusCapacity),
  assignedRouteId: z.string().optional(), // Will be cast to RouteId
  assignedDriverId: z.string().optional(), // Will be cast to UserId
  manufactureYear: z
    .number()
    .int()
    .min(1990)
    .max(new Date().getFullYear())
    .optional(),
  model: z.string().optional(),
});

export type RegisterBusCommand = z.infer<typeof RegisterBusCommandSchema>;
