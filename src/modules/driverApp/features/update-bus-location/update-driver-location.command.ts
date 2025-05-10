import { z } from 'zod';
import { Location } from '@core/domain/valueObjects/location.vo';

export const UpdateDriverLocationSchema = z.object({
  body: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    heading: z.number().min(0).max(360).optional(),
    speed: z.number().min(0).optional(),
    accuracy: z.number().min(0).optional(),
    busId: z.string().uuid().optional(), // Either busId or driverId must be provided
    driverId: z.string().uuid().optional(),
  }).refine(data => data.busId || data.driverId, {
    message: "Either busId or driverId must be provided"
  }),
});

export type UpdateDriverLocationCommand = {
  location: Location;
  heading?: number; // Direction in degrees (0-360)
  speed?: number; // Speed in km/h
  accuracy?: number; // Accuracy in meters
  busId?: string;
  driverId?: string;
}; 