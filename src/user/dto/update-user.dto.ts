export class UpdateUserRequestDto {
  email?: string;
  phone?: string;
  name?: string;
  password?: string;
  confirmPassword?: string;
}

export class UpdateUserResponseDto {
  email: string;
  phone: string | null;
  name: string;
}
