export class GetCartResponseDto {
  id: string;
  userId: string;
  items: {
    id: string;
    name: string;
    price: number;
    stock: number;
    images: string[];
    quantity: number;
  }[];
}
