export class UpdateItemQuantityRequestDto {
  quantity: number;
}

export class UpdateItemQuantityResponseDto extends UpdateItemQuantityRequestDto {
  id: string;
  cartId: string;
  productId: string;
  createdAt: Date;
}
