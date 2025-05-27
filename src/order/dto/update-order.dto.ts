import { ApiProperty } from '@nestjs/swagger';

enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export class UpdateOrderStatusRequestDto {
  @ApiProperty()
  status: OrderStatus;
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
