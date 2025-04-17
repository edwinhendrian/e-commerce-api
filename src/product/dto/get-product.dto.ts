export class GetAllProductResponseDto {
  id: string;
  name: string;
  price: number;
  images: string[];
  createdAt: Date;
}

export class GetProductResponseDto extends GetAllProductResponseDto {
  description: string | null;
  stock: number;
  category: string;
  updatedAt: Date;
}
