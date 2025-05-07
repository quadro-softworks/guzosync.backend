import { z } from 'zod';

export const GetRoutesQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().transform(val => parseInt(val || '1', 10)),
    limit: z.string().optional().transform(val => parseInt(val || '10', 10)),
    name: z.string().optional(),
    isActive: z.string().optional().transform(val => 
      val === undefined ? undefined : val === 'true'
    ),
  }),
});

export type GetRoutesQuery = z.infer<typeof GetRoutesQuerySchema>['query']; 