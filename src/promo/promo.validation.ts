import { z, ZodType } from 'zod';

export class PromoValidation {
  static readonly CREATE_PROMO: ZodType = z.object({
    code: z.string().min(1).max(100),
    description: z.string().min(1),
    discountType: z.string().min(1).max(10),
    discountValue: z.number().min(1).max(9999999999999),
    maxDiscount: z.number().min(1).max(9999999999999).optional(),
    minOrderAmount: z.number().min(1).max(9999999999999).optional(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
  });

  static readonly UPDATE_PROMO: ZodType = z.object({
    description: z.string().min(1).optional(),
    discountType: z.string().min(1).max(10).optional(),
    discountValue: z.number().min(1).max(9999999999999).optional(),
    maxDiscount: z.number().min(1).max(9999999999999).optional(),
    minOrderAmount: z.number().min(1).max(9999999999999).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  });
}
