import { z } from 'zod';
export const GetRouteDetailsSchema = z.object({
  params: z.object({
    routeId: z
      .string()
      .refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
        message: 'Invalid Route ID format',
      }),
  }),
});
