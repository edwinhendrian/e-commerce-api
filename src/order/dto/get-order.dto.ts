import { ApiProperty } from '@nestjs/swagger';
import { OrderAddressSnapshotDto, OrderItemsDto } from './order';

export class GetOrderResponseDto {
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
  orderAddressSnapshot: OrderAddressSnapshotDto;
  @ApiProperty({ type: OrderItemsDto, isArray: true })
  orderItems: OrderItemsDto[];
  @ApiProperty()
  createdAt: Date;
}
