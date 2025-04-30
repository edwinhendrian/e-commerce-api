import { ApiProperty } from '@nestjs/swagger';

export class LoginRequestDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
}

export class LoginResponseDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  token: string;
}
