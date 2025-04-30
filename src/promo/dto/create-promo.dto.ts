import { ApiProperty } from '@nestjs/swagger';

export class CreatePromoRequestDto {
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
}

export class CreatePromoResponseDto extends CreatePromoRequestDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
