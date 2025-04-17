export class CartRequestDto {
  productId: string;
  quantity: number;
}

export class CartResponseDto extends CartRequestDto {
  id: string;
  cartId: string;
  createdAt: Date;
}
