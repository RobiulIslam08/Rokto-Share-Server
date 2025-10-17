import { z } from 'zod';

const createBloodRequestSchemaValidation = z.object({
  body: z.object({
    donorId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid donor ID'),

    patientName: z
      .string()
     
      .trim(),

    patientAge: z
      .number()
      .min(1, 'Age must be at least 1')
      .max(120, 'Age must be less than 120'),

    hospital: z
      .string()
      
      .trim(),

    hospitalAddress: z
      .string()
    
      .trim(),
      
    // Corrected for older Zod
    unitsNeeded: z
      .number()
      .min(1, 'At least 1 unit is required')
      .max(10, 'Maximum 10 units are allowed'),

  
    urgency: z.enum(['Critical', 'Urgent', 'Normal'], {
      message: 'Invalid urgency level. Must be Critical, Urgent, or Normal.',
    }),

    neededDate: z
      .string()
      .min(1, 'Needed date is required')
      .refine(
        (date) => {
          const selectedDate = new Date(date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return selectedDate >= today;
        },
        { message: 'Needed date cannot be in the past' },
      ),

    neededTime: z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),

    contactPhone: z
      .string()
      .regex(/^01[3-9]\d{8}$/, 'Invalid Bangladesh phone number'),

    medicalCondition: z
      .string()
      
      .trim(),

    additionalNotes: z.string().trim().optional(),
  }),
});

const updateStatusSchemaValidation = z.object({
  body: z.object({
    // Corrected for older Zod
    status: z.enum(['Accepted', 'Rejected', 'Completed', 'Cancelled'], {
      message:
        'Invalid status. Must be Accepted, Rejected, Completed, or Cancelled.',
    }),
    rejectionReason: z.string().trim().optional(),
  }),
});

const getRequestsQuerySchemaValidation = z.object({
  query: z.object({
    status: z
      .enum(['Pending', 'Accepted', 'Rejected', 'Completed', 'Cancelled'])
      .optional(),
    urgency: z.enum(['Critical', 'Urgent', 'Normal']).optional(),
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});

export const BloodRequestValidations = {
  createBloodRequestSchemaValidation,
  updateStatusSchemaValidation,
  getRequestsQuerySchemaValidation,
};