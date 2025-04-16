export class CategoryRequestDto {
  name: string;
}

export class CategoryResponseDto extends CategoryRequestDto {
  createdAt: Date;
  updatedAt: Date;
}
