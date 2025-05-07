import { z } from 'zod';

export const SearchBusStopsQuerySchema = z.object({
  query: z.object({
    search: z.string().optional(),
    filterBy: z.enum(['name', 'location']).optional().default('name'),
    pn: z.string().optional().transform(val => parseInt(val || '1', 10)),
    ps: z.string().optional().transform(val => parseInt(val || '10', 10)),
    // Optional: latitude and longitude for location-based search
    lat: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
    lng: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
    // Optional: distance in kilometers for location-based search
    distance: z.string().optional().transform(val => val ? parseFloat(val) : 5), // Default 5km
  }),
});

export type SearchBusStopsQuery = z.infer<typeof SearchBusStopsQuerySchema>['query']; 