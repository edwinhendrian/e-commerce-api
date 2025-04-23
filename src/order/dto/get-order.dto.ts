export class GetOrderResponseDto {
  id: string;
  userId: string;
  orderNumber: string;
  totalAmount: number;
  shippingCost: number;
  promoDiscount: number;
  status: string;
  paymentStatus: string;
  orderAddressSnapshot: {
    id: string;
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
  };
  orderItems: {
    id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    price: number;
  }[];
  createdAt: Date;
}
