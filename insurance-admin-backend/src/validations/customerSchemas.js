import { z } from 'zod';

export const createCustomerSchema = z.object({
  // Admin can supply agent_id; for agent route you ignore it and use req.session.user.id
  agent_id: z.string().uuid().optional(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.coerce.number().int().min(0).max(120).optional(),
  defenders_like: z.string().optional(),
  number_of_children: z.coerce.number().int().min(0).max(20).optional(),
  spouse: z.string().optional(),
  parents: z.string().optional(),
  // default to 'pending' if omitted; agents should not be allowed to set Verified/Unverified themselves (enforce in controller)
  status: z.enum(['pending', 'Verified', 'Unverified']).default('pending'),
  aadhaar_number: z.string().length(12, 'Aadhaar must be 12 digits').optional(),
  pan_number: z.string().length(10, 'PAN must be 10 characters').optional()
});

// Admin-only: change from 'pending' -> 'Verified' or 'Unverified'
export const updateCustomerStatusSchema = z.object({
  status: z.enum(['Verified', 'Unverified'])
});

// (optional) admin list filters
export const listCustomersFilterSchema = z.object({
  status: z.enum(['pending','Verified','Unverified']).optional(),
  from: z.string().datetime({ offset: false }).or(z.string().date()).optional(),
  to: z.string().datetime({ offset: false }).or(z.string().date()).optional(),
  q: z.string().optional()
}).partial();
