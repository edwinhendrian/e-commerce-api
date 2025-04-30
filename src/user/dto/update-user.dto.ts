import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserRequestDto {
  @ApiPropertyOptional()
  email?: string;
  @ApiPropertyOptional()
  phone?: string;
  @ApiPropertyOptional()
  name?: string;
  @ApiPropertyOptional()
  password?: string;
  @ApiPropertyOptional()
  confirmPassword?: string;
}

export class UpdateUserResponseDto {
  @ApiProperty()
  email: string;
  @ApiProperty({ type: 'string' })
  phone: string | null;
  @ApiProperty()
  name: string;
}

export class UpdateAvatarResponseDto {
  @ApiProperty({ type: 'string' })
  avatarUrl: string | null;
}

export class AvatarUploadRequestDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
