import { z } from 'zod';

export const AssignBusToRouteSchema = z.object({
  params: z.object({
    busId: z.string().trim(),
    routeId: z.string().trim(),
  }),
});

export type AssignBusToRouteCommand = z.infer<typeof AssignBusToRouteSchema>['params']; 