import { ApiProperty } from '@nestjs/swagger';

enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FLAT = 'FLAT',
}

export class CreatePromoRequestDto {
  @ApiProperty()
  code: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  discountType: DiscountType;
  @ApiProperty()
  discountValue: number;
  @ApiProperty({ type: 'number' })
  maxDiscount?: number | null;
  @ApiProperty({ type: 'number' })
  minOrderAmount?: number | null;
  @ApiProperty()
  startDate: Date;
  @ApiProperty()
  endDate: Date;
}

export class CreatePromoResponseDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  code: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  discountType: string;
  @ApiProperty()
  discountValue: number;
  @ApiProperty({ type: 'number' })
  maxDiscount?: number | null;
  @ApiProperty({ type: 'number' })
  minOrderAmount?: number | null;
  @ApiProperty()
  startDate: Date;
  @ApiProperty()
  endDate: Date;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
