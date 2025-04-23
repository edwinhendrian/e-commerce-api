export class GetUserAddressResponseDto {
  id: string;
  userId: string;
  recipientName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2: string | null;
  subDistrict: string;
  district: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;
  isPrimary: boolean;
  createdAt: Date;
}
