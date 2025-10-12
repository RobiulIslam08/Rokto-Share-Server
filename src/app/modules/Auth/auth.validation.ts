import z from 'zod';
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;

const loginUserValidationSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid Email Address'),
    password: z.string(),
  }),
});
const registerDonorValidationSchema = z.object({
  body: z
    .object({
      name: z.string().min(2, 'Name must be at least 2 characters'),
      email: z.string().email('Invalid email address'),
      phone: z.string().regex(/^01[3-9]\d{8}$/, 'Invalid phone number'),
      password: z.string().min(8, 'Password must be at least 8 characters'),
      confirmPassword: z.string(),
      bloodGroup: z.enum(bloodGroups),
      age: z.coerce.number().min(18).max(65),
      weight: z.coerce.number().min(45),
      previousDonations: z.coerce.number().min(0).optional(),
      lastDonation: z.string().optional(),
      medicalHistory: z.string().optional(),
      division: z.string(),
      district: z.string(),
      upazila: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
	  path: ['confirmPassword'],
    }),
});
export const AuthValidations = {
  loginUserValidationSchema,
  registerDonorValidationSchema,
};