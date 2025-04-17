import { z, ZodType } from 'zod';

export class CartValidation {
  static readonly ADD_CART: ZodType = z.object({
    productId: z.string().min(1),
    quantity: z.number().min(1),
  });

  static readonly UPDATE_ITEM: ZodType = z.object({
    quantity: z.number().min(1),
  });
}
