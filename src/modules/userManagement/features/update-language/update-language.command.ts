import { z } from 'zod';

export const UpdateLanguageSchema = z.object({
  languageCode: z.string().min(2).max(5),
});

export type UpdateLanguageCommand = z.infer<typeof UpdateLanguageSchema>; 