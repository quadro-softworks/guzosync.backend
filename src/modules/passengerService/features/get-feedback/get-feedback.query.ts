import { z } from 'zod';

export const GetFeedbackQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().transform(val => parseInt(val || '1', 10)),
    limit: z.string().optional().transform(val => parseInt(val || '10', 10)),
    sortBy: z.enum(['createdAt', 'rating', 'dateOfTrip']).optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  }),
});

export type GetFeedbackQuery = z.infer<typeof GetFeedbackQuerySchema>['query']; 