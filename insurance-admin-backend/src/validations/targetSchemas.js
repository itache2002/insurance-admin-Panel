import { z } from 'zod';

export const upsertTargetSchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}-01$/),
  target_value: z.number().nonnegative(),
  description: z.string().optional()
});

export const updateTargetSchema = z.object({
  target_value: z.number().nonnegative(),
  description: z.string().optional()
});
