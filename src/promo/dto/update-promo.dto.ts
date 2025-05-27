import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FLAT = 'FLAT',
}

export class UpdatePromoRequestDto {
  @ApiPropertyOptional()
  description?: string;
  @ApiPropertyOptional()
  discountType?: DiscountType;
  @ApiPropertyOptional()
  discountValue?: number;
  @ApiPropertyOptional({ type: 'number' })
  maxDiscount?: number | null;
  @ApiPropertyOptional({ type: 'number' })
  minOrderAmount?: number | null;
  @ApiPropertyOptional()
  startDate?: Date;
  @ApiPropertyOptional()
  endDate?: Date;
}

export class UpdatePromoResponseDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  code: string;
  @ApiPropertyOptional()
  description?: string;
  @ApiPropertyOptional()
  discountType?: string;
  @ApiPropertyOptional()
  discountValue?: number;
  @ApiPropertyOptional({ type: 'number' })
  maxDiscount?: number | null;
  @ApiPropertyOptional({ type: 'number' })
  minOrderAmount?: number | null;
  @ApiPropertyOptional()
  startDate?: Date;
  @ApiPropertyOptional()
  endDate?: Date;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
