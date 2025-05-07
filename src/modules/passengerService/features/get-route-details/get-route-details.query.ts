import { z } from 'zod';

export const GetRouteDetailsQuerySchema = z.object({
  params: z.object({
    routeId: z.string().trim(),
  }),
});

export type GetRouteDetailsQuery = z.infer<typeof GetRouteDetailsQuerySchema>['params']; 