import { z } from 'zod';

export const GetBusStopsQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().transform(val => parseInt(val || '1', 10)),
    limit: z.string().optional().transform(val => parseInt(val || '10', 10)),
    name: z.string().optional(),
    isActive: z.string().optional().transform(val => 
      val === undefined ? undefined : val === 'true'
    ),
  }),
});

export type GetBusStopsQuery = z.infer<typeof GetBusStopsQuerySchema>['query']; 