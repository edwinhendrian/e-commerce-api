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

export class UpdateProductImagesResponseDto {
  image_urls: (string | undefined)[];
}
