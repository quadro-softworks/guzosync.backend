import { z } from 'zod';

export const DeleteAlertSchema = z.object({
  params: z.object({
    alertId: z.string().trim(),
  }),
});

export type DeleteAlertCommand = z.infer<typeof DeleteAlertSchema>['params']; 