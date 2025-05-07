import { z } from 'zod';

export const UpdateBusLocationSchema = z.object({
  params: z.object({
    busId: z.string().trim(),
  }),
  body: z.object({
    location: z.object({
      coordinates: z.tuple([
        z.number().min(-180).max(180), // longitude
        z.number().min(-90).max(90),   // latitude
      ]).transform(coords => ({
        type: 'Point',
        coordinates: coords,
      })),
    }),
  }),
});

export type UpdateBusLocationCommand = {
  busId: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
}; 