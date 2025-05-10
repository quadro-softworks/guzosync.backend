import { z } from 'zod';

export const UpdateMyProfileSchema = z.object({
  body: z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters').optional(),
    lastName: z.string().min(2, 'Last name must be at least 2 characters').optional(),
    phoneNumber: z.string().min(7, 'Phone number must be at least 7 digits').optional(),
    dateOfBirth: z.string()
      .refine(val => {
        const date = new Date(val);
        return !isNaN(date.getTime());
      }, 'Invalid date format')
      .optional(),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']).optional(),
    profilePicture: z.string().url('Invalid URL format').optional(),
    bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
    address: z.object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zipCode: z.string().optional(),
      country: z.string().optional(),
    }).optional(),
    emergencyContact: z.object({
      name: z.string().min(2, 'Name must be at least 2 characters'),
      relation: z.string(),
      phoneNumber: z.string().min(7, 'Phone number must be at least 7 digits'),
    }).optional(),
    travelPreferences: z.object({
      preferredSeating: z.string().optional(),
      mobilityRequirements: z.boolean().optional(),
      preferredRoutes: z.array(z.string()).optional(),
      frequentlyVisitedStops: z.array(z.string()).optional(),
    }).optional(),
  }),
});

export type UpdateMyProfileCommand = z.infer<typeof UpdateMyProfileSchema>['body']; 