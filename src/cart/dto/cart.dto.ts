import { ApiProperty } from '@nestjs/swagger';

export class CartRequestDto {
  @ApiProperty()
  productId: string;
  @ApiProperty()
  quantity: number;
}

export class CartResponseDto extends CartRequestDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  cartId: string;
  @ApiProperty()
  createdAt: Date;
}
