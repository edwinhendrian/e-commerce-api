import { ApiProperty } from '@nestjs/swagger';

export class GetUserResponseDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  emailValidated: boolean;
  @ApiProperty({ type: 'string' })
  phone: string | null;
  @ApiProperty()
  phoneValidated: boolean;
  @ApiProperty()
  role: string;
  @ApiProperty()
  name: string;
  @ApiProperty({ type: 'string' })
  avatarUrl: string | null;
  @ApiProperty({ type: 'string' })
  token: string | null;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty({ type: 'string', format: 'date-time' })
  lastLogin: Date | null;
}
