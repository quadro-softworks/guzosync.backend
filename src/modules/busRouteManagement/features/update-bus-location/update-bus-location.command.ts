import { z } from 'zod';
import { Location } from '@core/domain/valueObjects/location.vo';

export const UpdateBusLocationSchema = z.object({
  params: z.object({
    busId: z.string().trim(),
  }),
  body: z.object({
    location: z.object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
      address: z.string().optional(),
    }).transform(loc => ({
      coordinates: [loc.longitude, loc.latitude],
      type: 'Point',
    })),
  }),
});

export type UpdateBusLocationCommand = {
  busId: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
}; 