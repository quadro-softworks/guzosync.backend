import { z } from 'zod';
import { AlertType } from '../create-alert/create-alert.command';

export const UpdateAlertSchema = z.object({
  params: z.object({
    alertId: z.string().trim(),
  }),
  body: z.object({
    alertType: z.nativeEnum(AlertType).optional(),
    threshold: z.number().optional(),
    message: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

export type UpdateAlertCommand = {
  alertId: string;
  updates: z.infer<typeof UpdateAlertSchema>['body'];
}; 