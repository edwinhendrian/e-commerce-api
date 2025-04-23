export class CreateUserAddressRequestDto {
  recipientName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string | null;
  subDistrict: string;
  district: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;
}

export class CreateUserAddressResponseDto extends CreateUserAddressRequestDto {
  id: string;
  userId: string;
  isPrimary: boolean;
  createdAt: Date;
}
