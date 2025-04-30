import { ApiProperty } from '@nestjs/swagger';

export class GetCartResponseDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  userId: string;
  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        price: { type: 'number' },
        stock: { type: 'number' },
        images: { type: 'array', items: { type: 'string' } },
        quantity: { type: 'number' },
      },
    },
  })
  items: {
    id: string;
    name: string;
    price: number;
    stock: number;
    images: string[];
    quantity: number;
  }[];
}
