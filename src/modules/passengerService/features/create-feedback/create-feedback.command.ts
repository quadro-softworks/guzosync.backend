import { z } from 'zod';

export const CreateFeedbackSchema = z.object({
  body: z.object({
    tripId: z.string().optional(), // Optional as the passenger might not know the trip ID
    busId: z.string().trim(),
    routeId: z.string().trim(),
    rating: z.number().min(1).max(5), // 1-5 star rating
    comments: z.string().max(500).optional(),
    feedbackType: z.enum(['SERVICE', 'CLEANLINESS', 'PUNCTUALITY', 'SAFETY', 'OTHER']).optional(),
    dateOfTrip: z.string().optional().transform(val => val ? new Date(val) : new Date()),
  }),
});

export type CreateFeedbackCommand = z.infer<typeof CreateFeedbackSchema>['body']; 