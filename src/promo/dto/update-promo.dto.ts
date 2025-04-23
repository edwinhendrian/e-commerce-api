export class UpdatePromoRequestDto {
  description?: string;
  discountType?: string;
  discountValue?: number;
  maxDiscount?: number | null;
  minOrderAmount?: number | null;
  startDate?: Date;
  endDate?: Date;
}

export class UpdatePromoResponseDto extends UpdatePromoRequestDto {
  id: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;
}
