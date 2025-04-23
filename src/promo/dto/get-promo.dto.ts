export class GetPromoResponseDto {
  id: string;
  code: string;
  description: string;
  discountType: string;
  discountValue: number;
  maxDiscount?: number | null;
  minOrderAmount?: number | null;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
