import { ApiProperty } from '@nestjs/swagger';

export class AddressDto {
  @ApiProperty()
  recipientName: string;
  @ApiProperty()
  phoneNumber: string;
  @ApiProperty()
  addressLine1: string;
  @ApiProperty({ type: 'string' })
  addressLine2: string | null;
  @ApiProperty()
  subDistrict: string;
  @ApiProperty()
  district: string;
  @ApiProperty()
  city: string;
  @ApiProperty()
  province: string;
  @ApiProperty()
  country: string;
  @ApiProperty()
  postalCode: string;
}

export class OrderAddressSnapshotDto extends AddressDto {
  @ApiProperty()
  id: string;
}

export class OrderItemsDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  order_id: string;
  @ApiProperty()
  product_id: string;
  @ApiProperty()
  quantity: number;
  @ApiProperty()
  price: number;
}
