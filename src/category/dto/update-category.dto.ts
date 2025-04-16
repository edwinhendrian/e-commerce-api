import { CategoryResponseDto } from './category.dto';

export { CategoryRequestDto as UpdateCategoryRequestDto } from './category.dto';

export class UpdateCategoryResponseDto extends CategoryResponseDto {
  id: string;
}
