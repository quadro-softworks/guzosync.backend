import { z } from 'zod';

// Schema for validating mobile app location updates
export const updateBusLocationMobileSchema = z.object({
  busId: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  accuracy: z.number().optional(),
  speed: z.number().optional(),
  heading: z.number().optional(),
  timestamp: z.string().or(z.date()).optional(),
  routeId: z.string().optional(),
});

// Type for the validated command
export type UpdateBusLocationMobileCommand = z.infer<typeof updateBusLocationMobileSchema>;
