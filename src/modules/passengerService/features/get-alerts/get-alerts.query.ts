import { z } from 'zod';

export const GetAlertsQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().transform(val => parseInt(val || '1', 10)),
    limit: z.string().optional().transform(val => parseInt(val || '10', 10)),
    isActive: z.string().optional().transform(val => 
      val === undefined ? undefined : val === 'true'
    ),
    targetType: z.string().optional(),
    alertType: z.string().optional(),
  }),
});

export type GetAlertsQuery = z.infer<typeof GetAlertsQuerySchema>['query']; 