import { z } from 'zod';

const updateProfileValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    phone: z.string().regex(/^01[3-9]\d{8}$/, 'Invalid phone number').optional(),
    age: z.number().min(18).max(65).optional(),
    weight: z.number().min(45).optional(),
    location: z.object({
      division: z.string(),
      district: z.string(),
      upazila: z.string(),
    }).optional(),
    isAvailable: z.boolean().optional(),
    lastDonationDate: z.string().optional(),
    medicalHistory: z.string().optional(),
  }),
});

export const UserValidations = {
  updateProfileValidationSchema,
};
