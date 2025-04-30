import { ApiProperty } from '@nestjs/swagger';

export class CategoryRequestDto {
  @ApiProperty()
  name: string;
}

export class CategoryResponseDto extends CategoryRequestDto {
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
