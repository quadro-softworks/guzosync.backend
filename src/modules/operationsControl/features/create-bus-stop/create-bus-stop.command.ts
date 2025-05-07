import { z } from 'zod';

export const CreateBusStopSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Bus stop name must be at least 2 characters').trim(),
    location: z.object({
      coordinates: z.tuple([
        z.number().min(-180).max(180), // longitude
        z.number().min(-90).max(90),   // latitude
      ]).transform(coords => ({
        type: 'Point',
        coordinates: coords,
      })),
    }),
    capacity: z.number().int().positive().optional(),
    isActive: z.boolean().default(true),
  }),
});

export type CreateBusStopCommand = z.infer<typeof CreateBusStopSchema>['body']; 