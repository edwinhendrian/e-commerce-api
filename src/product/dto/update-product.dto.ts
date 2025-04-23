export class UpdateProductRequestDto {
  description?: string | null;
  price?: number;
  stock?: number;
  categoryId?: string;
}

export class UpdateProductResponseDto extends UpdateProductRequestDto {
  id: string;
  name: string;
  category: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

export class UpdateProductImagesResponseDto {
  imageUrls: (string | undefined)[];
}
