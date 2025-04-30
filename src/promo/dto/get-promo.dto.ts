import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetPromoResponseDto {
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
  @ApiPropertyOptional({ type: 'number' })
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
