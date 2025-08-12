import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const createAdminSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone_no: z.string().min(8),
  password: z.string().min(8)
});
