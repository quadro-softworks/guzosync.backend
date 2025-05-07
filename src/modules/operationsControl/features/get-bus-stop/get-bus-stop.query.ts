import { z } from 'zod';

export const GetBusStopQuerySchema = z.object({
  params: z.object({
    busStopId: z.string().trim(),
  }),
});

export type GetBusStopQuery = z.infer<typeof GetBusStopQuerySchema>['params']; 