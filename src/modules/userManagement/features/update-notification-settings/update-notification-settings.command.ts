import { z } from 'zod';

export const UpdateNotificationSettingsSchema = z.object({
  emailNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  smsNotifications: z.boolean().optional(),
  notificationTypes: z.object({
    alerts: z.boolean().optional(),
    busDelays: z.boolean().optional(),
    routeChanges: z.boolean().optional(),
    promotions: z.boolean().optional(),
    systemUpdates: z.boolean().optional(),
  }).optional(),
});

export type UpdateNotificationSettingsCommand = z.infer<typeof UpdateNotificationSettingsSchema>; 