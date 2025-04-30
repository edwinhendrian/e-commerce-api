import { ApiProperty } from '@nestjs/swagger';

export class UpdateItemQuantityRequestDto {
  @ApiProperty()
  quantity: number;
}

export class UpdateItemQuantityResponseDto extends UpdateItemQuantityRequestDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  cartId: string;
  @ApiProperty()
  productId: string;
  @ApiProperty()
  createdAt: Date;
}
