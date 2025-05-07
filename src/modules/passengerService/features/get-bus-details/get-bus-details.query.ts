import { z } from 'zod';

export const GetBusDetailsQuerySchema = z.object({
  params: z.object({
    busId: z.string().trim(),
  }),
});

export type GetBusDetailsQuery = z.infer<typeof GetBusDetailsQuerySchema>['params']; 