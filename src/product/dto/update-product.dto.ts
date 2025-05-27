import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductRequestDto {
  @ApiProperty()
  name: string;
  @ApiPropertyOptional({ type: 'string' })
  description?: string | null;
  @ApiPropertyOptional()
  price?: number;
  @ApiPropertyOptional()
  stock?: number;
  @ApiPropertyOptional()
  categoryId?: string;
}

export class UpdateProductResponseDto extends UpdateProductRequestDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  category: string;
  @ApiProperty()
  images: string[];
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}

export class UpdateProductImagesDto {
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  files: any[];
}

export class UpdateProductImagesResponseDto {
  @ApiProperty({ type: 'string', isArray: true })
  imageUrls: (string | undefined)[];
}
