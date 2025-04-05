import { z } from 'zod';
export const GetBusDetailsSchema = z.object({
  params: z.object({
    busId: z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
      message: 'Invalid Bus ID format',
    }),
  }),
});
