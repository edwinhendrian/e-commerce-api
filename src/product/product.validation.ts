import { z, ZodType } from 'zod';

export class ProductValidation {
  static readonly CREATE_PRODUCT: ZodType = z.object({
    name: z.string().min(1).max(100),
    description: z.string().min(1).optional(),
    price: z.number().min(0),
    stock: z.number().min(0),
    categoryId: z.string().min(1),
  });

  static readonly UPDATE_PRODUCT: ZodType = z.object({
    description: z.string().min(1).optional(),
    price: z.number().min(0),
    stock: z.number().min(0),
    categoryId: z.string().min(1),
  });
}
