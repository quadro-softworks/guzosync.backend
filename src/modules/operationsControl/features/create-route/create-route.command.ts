import { z } from 'zod';

export const CreateRouteSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Route name must be at least 2 characters').trim(),
    description: z.string().optional(),
    stopIds: z.array(z.string()).min(2, 'A route must have at least 2 stops'),
    totalDistance: z.number().positive().optional(),
    estimatedDuration: z.number().positive().optional(),
    isActive: z.boolean().default(true),
  }),
});

export type CreateRouteCommand = z.infer<typeof CreateRouteSchema>['body']; 