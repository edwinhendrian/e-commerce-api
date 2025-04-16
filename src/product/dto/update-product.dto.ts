export class UpdateProductRequestDto {
  description?: string | null;
  price?: number;
  stock?: number;
  categoryId?: string;
}

export class UpdateProductResponseDto extends UpdateProductRequestDto {
  id: string;
  name: string;
}
