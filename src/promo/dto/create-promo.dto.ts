export class CreatePromoRequestDto {
  code: string;
  description: string;
  discountType: string;
  discountValue: number;
  maxDiscount?: number | null;
  minOrderAmount?: number | null;
  startDate: Date;
  endDate: Date;
}

export class CreatePromoResponseDto extends CreatePromoRequestDto {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
