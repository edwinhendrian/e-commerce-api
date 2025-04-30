import { ApiProperty } from '@nestjs/swagger';
import { CategoryResponseDto } from './category.dto';

export { CategoryRequestDto as CreateCategoryRequestDto } from './category.dto';

export class CreateCategoryResponseDto extends CategoryResponseDto {
  @ApiProperty()
  id: string;
}
