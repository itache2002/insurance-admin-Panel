import { z } from 'zod';

export const createAgentSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone_no: z.string().min(8),
  password: z.string().optional(),
  pan_number: z.string().min(10).max(10),
  aadhaar_number: z.string().min(12).max(12),
  bank_name: z.string().min(2),
  account_no: z.string().min(6),
  ifsc_code: z.string().min(4),
  tenth_percent: z.number().optional(),
  twelfth_percent: z.number().optional(),
  degree_percent: z.number().optional()
});

export const updateAgentSelfSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone_no: z.string().min(8)
});
