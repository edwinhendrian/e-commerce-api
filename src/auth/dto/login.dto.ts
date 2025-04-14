export class LoginRequestDto {
  email: string;
  password: string;
}

export class LoginResponseDto {
  name: string;
  token?: string | null;
}
