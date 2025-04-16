export class CreateProductRequestDto {
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  categoryId: string;
}

export class CreateProductResponseDto extends CreateProductRequestDto {
  id: string;
}
