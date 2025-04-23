export class UpdateUserAddressRequestDto {
  recipientName?: string;
  phoneNumber?: string;
  addressLine1?: string;
  addressLine2?: string | null;
  subDistrict?: string;
  district?: string;
  city?: string;
  province?: string;
  country?: string;
  postalCode?: string;
  isPrimary?: boolean;
}

export class UpdateUserAddressResponseDto extends UpdateUserAddressRequestDto {
  id: string;
  userId: string;
  createdAt: Date;
}
