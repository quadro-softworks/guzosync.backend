import { z } from 'zod';

export const UpdateBusStopSchema = z.object({
  params: z.object({
    busStopId: z.string().trim(),
  }),
  body: z.object({
    name: z.string().min(2, 'Bus stop name must be at least 2 characters').trim().optional(),
    location: z.object({
      coordinates: z.tuple([
        z.number().min(-180).max(180), // longitude
        z.number().min(-90).max(90),   // latitude
      ]).transform(coords => ({
        type: 'Point',
        coordinates: coords,
      })),
    }).optional(),
    capacity: z.number().int().positive().optional(),
    isActive: z.boolean().optional(),
  }),
});

export type UpdateBusStopCommand = {
  busStopId: string;
  updates: z.infer<typeof UpdateBusStopSchema>['body'];
}; 