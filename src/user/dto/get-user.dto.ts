export class GetUserResponseDto {
  id: string;
  email: string;
  emailValidated: boolean;
  phone: string | null;
  phoneValidated: boolean;
  role: string;
  name: string;
  avatarUrl: string | null;
  token: string | null;
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date | null;
}
