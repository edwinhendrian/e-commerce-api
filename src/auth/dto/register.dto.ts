export class RegisterRequestDto {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export class RegisterResponseDto {
  name: string;
  email: string;
  token?: string;
}
