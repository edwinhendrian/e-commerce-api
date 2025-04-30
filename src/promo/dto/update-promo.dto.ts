import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePromoRequestDto {
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
}

export class UpdatePromoResponseDto extends UpdatePromoRequestDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  code: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
