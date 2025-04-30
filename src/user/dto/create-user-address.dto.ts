import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserAddressRequestDto {
  @ApiProperty()
  recipientName: string;
  @ApiProperty()
  phoneNumber: string;
  @ApiProperty()
  addressLine1: string;
  @ApiPropertyOptional({ type: 'string' })
  addressLine2?: string | null;
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

export class CreateUserAddressResponseDto extends CreateUserAddressRequestDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  userId: string;
  @ApiProperty()
  isPrimary: boolean;
  @ApiProperty()
  createdAt: Date;
}
