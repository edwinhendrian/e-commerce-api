import { ApiProperty } from '@nestjs/swagger';
import { AddressDto, OrderAddressSnapshotDto, OrderItemsDto } from './order';

export class CreateOrderRequestDto {
  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        productId: { type: 'string' },
        quantity: { type: 'number' },
      },
    },
  })
  items: [
    {
      productId: string;
      quantity: number;
    },
  ];
  @ApiProperty()
  address: AddressDto;
  @ApiProperty()
  shippingCost: number;
  @ApiProperty({ type: 'string' })
  code: string | null;
}

export class CreateOrderResponseDto {
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
