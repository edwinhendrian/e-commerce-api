import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductRequestDto {
  @ApiProperty()
  name: string;
  @ApiPropertyOptional({ type: 'string' })
  description?: string | null;
  @ApiProperty()
  price: number;
  @ApiProperty()
  stock: number;
  @ApiProperty()
  categoryId: string;
}

export class CreateProductResponseDto extends CreateProductRequestDto {
  @ApiProperty()
  id: string;
}
