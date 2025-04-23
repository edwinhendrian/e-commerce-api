import { z, ZodType } from 'zod';

export class OrderValidation {
  static readonly CREATE_ORDER: ZodType = z.object({
    items: z.array(
      z.object({
        productId: z.string().min(0),
        quantity: z.number().min(1),
      }),
    ),
    address: z.object({
      recipientName: z.string().min(1).max(100),
      phoneNumber: z.string().min(1).max(20),
      addressLine1: z.string().min(1).max(255),
      addressLine2: z.string().min(1).max(255).nullable(),
      subDistrict: z.string().min(1).max(100),
      district: z.string().min(1).max(100),
      city: z.string().min(1).max(100),
      province: z.string().min(1).max(100),
      country: z.string().min(1).max(100),
      postalCode: z.string().min(1).max(5),
    }),
    shippingCost: z.number().min(0),
    code: z.string().min(1).max(100).nullish(),
  });
}
