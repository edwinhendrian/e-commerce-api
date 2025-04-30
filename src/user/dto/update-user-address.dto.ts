import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserAddressRequestDto {
  @ApiPropertyOptional()
  recipientName?: string;
  @ApiPropertyOptional()
  phoneNumber?: string;
  @ApiPropertyOptional()
  addressLine1?: string;
  @ApiPropertyOptional({ type: 'string' })
  addressLine2?: string | null;
  @ApiPropertyOptional()
  subDistrict?: string;
  @ApiPropertyOptional()
  district?: string;
  @ApiPropertyOptional()
  city?: string;
  @ApiPropertyOptional()
  province?: string;
  @ApiPropertyOptional()
  country?: string;
  @ApiPropertyOptional()
  postalCode?: string;
  @ApiPropertyOptional()
  isPrimary?: boolean;
}

export class UpdateUserAddressResponseDto extends UpdateUserAddressRequestDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  userId: string;
  @ApiProperty()
  createdAt: Date;
}
