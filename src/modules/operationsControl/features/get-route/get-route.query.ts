import { z } from 'zod';

export const GetRouteQuerySchema = z.object({
  params: z.object({
    routeId: z.string().trim(),
  }),
});

export type GetRouteQuery = z.infer<typeof GetRouteQuerySchema>['params']; 