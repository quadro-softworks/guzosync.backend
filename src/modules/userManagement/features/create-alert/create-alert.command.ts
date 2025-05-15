import { z } from 'zod';

// Define the alert types
export enum AlertType {
  DELAY = 'DELAY',
  ARRIVAL = 'ARRIVAL',
  DEPARTURE = 'DEPARTURE',
  ROUTE_CHANGE = 'ROUTE_CHANGE',
  ETA_CHANGE = 'ETA_CHANGE',
  CAPACITY = 'CAPACITY'
}

export const CreateAlertSchema = z.object({
  body: z.object({
    alertType: z.nativeEnum(AlertType),
    targetId: z.string().trim(), // Bus ID or Route ID
    targetType: z.enum(['BUS', 'ROUTE', 'BUS_STOP']),
    threshold: z.number().optional(), // For delay or ETA change in minutes
    message: z.string().optional(),
    isActive: z.boolean().default(true),
  }),
});

export type CreateAlertCommand = z.infer<typeof CreateAlertSchema>['body']; 