export class UpdateOrderStatusRequestDto {
  status: string;
}

export class UpdateOrderResponseDto {
  id: string;
  userId: string;
  orderNumber: string;
  totalAmount: number;
  shippingCost: number;
  promoDiscount: number;
  status: string;
  paymentStatus: string;
  createdAt: Date;
}
