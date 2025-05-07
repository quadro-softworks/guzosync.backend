import { z } from 'zod';

export const DeleteBusStopSchema = z.object({
  params: z.object({
    busStopId: z.string().trim(),
  }),
});

export type DeleteBusStopCommand = z.infer<typeof DeleteBusStopSchema>['params']; 