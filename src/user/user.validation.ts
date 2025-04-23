import { z, ZodType } from 'zod';

export class UserValidation {
  static readonly UPDATE_USER: ZodType = z.object({
    email: z.string().email().optional(),
    phone: z.string().min(1).max(20).optional(),
    name: z.string().min(1).max(100).optional(),
    password: z.string().min(8).optional(),
    confirmPassword: z.string().min(8).optional(),
  });

  static readonly CREATE_USER_ADDRESS: ZodType = z.object({
    recipientName: z.string().min(1).max(100),
    phoneNumber: z.string().min(1).max(20),
    addressLine1: z.string().min(1).max(255),
    addressLine2: z.string().min(1).max(255).optional(),
    subDistrict: z.string().min(1).max(100),
    district: z.string().min(1).max(100),
    city: z.string().min(1).max(100),
    province: z.string().min(1).max(100),
    country: z.string().min(1).max(100),
    postalCode: z.string().min(1).max(5),
  });

  static readonly UPDATE_USER_ADDRESS: ZodType = z.object({
    recipientName: z.string().min(1).max(100),
    phoneNumber: z.string().min(1).max(20),
    addressLine1: z.string().min(1).max(255),
    addressLine2: z.string().min(1).max(255).optional(),
    subDistrict: z.string().min(1).max(100),
    district: z.string().min(1).max(100),
    city: z.string().min(1).max(100),
    province: z.string().min(1).max(100),
    country: z.string().min(1).max(100),
    postalCode: z.string().min(1).max(5),
    isPrimary: z.boolean().optional(),
  });
}
