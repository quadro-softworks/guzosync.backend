import { z } from 'zod';

export const TrackBusLocationQuerySchema = z.object({
  params: z.object({
    busId: z.string().trim(),
  }),
});

export type TrackBusLocationQuery = z.infer<typeof TrackBusLocationQuerySchema>['params']; 