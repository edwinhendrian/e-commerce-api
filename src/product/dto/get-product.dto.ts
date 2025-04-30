import { ApiProperty } from '@nestjs/swagger';

export class GetAllProductResponseDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  price: number;
  @ApiProperty()
  images: string[];
  @ApiProperty()
  createdAt: Date;
}

export class GetProductResponseDto extends GetAllProductResponseDto {
  @ApiProperty({ type: 'string' })
  description: string | null;
  @ApiProperty()
  stock: number;
  @ApiProperty()
  category: string;
  @ApiProperty()
  updatedAt: Date;
}
