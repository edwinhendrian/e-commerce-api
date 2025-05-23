import { ApiProperty } from '@nestjs/swagger';

export class GetUserAddressResponseDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  userId: string;
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
  @ApiProperty()
  isPrimary: boolean;
  @ApiProperty()
  createdAt: Date;
}
