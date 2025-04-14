import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequestDto, RegisterResponseDto } from './dto/register.dto';
import { LoginRequestDto, LoginResponseDto } from './dto/login.dto';
import { WebResponse } from 'src/common/web-response';

@Controller('/api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @HttpCode(200)
  async register(
    @Body() request: RegisterRequestDto,
  ): Promise<WebResponse<RegisterResponseDto>> {
    const result = await this.authService.register(request);
    return {
      data: result,
    };
  }

  @Post('/login')
  @HttpCode(200)
  async login(
    @Body() request: LoginRequestDto,
  ): Promise<WebResponse<LoginResponseDto>> {
    const result = await this.authService.login(request);
    return {
      data: result,
    };
  }
}
