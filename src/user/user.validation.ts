import { z, ZodType } from 'zod';

export class UserValidation {
  static readonly UPDATE_USER: ZodType = z.object({
    email: z.string().email().optional(),
    phone: z.string().min(1).max(20).optional(),
    name: z.string().min(1).max(100).optional(),
    password: z.string().min(8).optional(),
    confirmPassword: z.string().min(8).optional(),
  });
}
