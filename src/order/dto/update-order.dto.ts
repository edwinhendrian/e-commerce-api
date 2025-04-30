import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderStatusRequestDto {
  @ApiProperty()
  status: string;
}

export class UpdateOrderResponseDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  userId: string;
  @ApiProperty()
  orderNumber: string;
  @ApiProperty()
  totalAmount: number;
  @ApiProperty()
  shippingCost: number;
  @ApiProperty()
  promoDiscount: number;
  @ApiProperty()
  status: string;
  @ApiProperty()
  paymentStatus: string;
  @ApiProperty()
  createdAt: Date;
}
