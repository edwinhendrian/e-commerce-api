import { z, ZodType } from 'zod';

export class CategoryValidation {
  static readonly CATEGORY: ZodType = z.object({
    name: z.string().min(1).max(100),
  });
}
