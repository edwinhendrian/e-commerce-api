import { Body, Controller, Delete, HttpCode, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequestDto, RegisterResponseDto } from './dto/register.dto';
import { LoginRequestDto, LoginResponseDto } from './dto/login.dto';
import { WebResponse } from 'src/common/web-response';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthDto } from './dto/auth.dto';

@Controller('/api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/register')
  @HttpCode(201)
  async register(
    @Body() request: RegisterRequestDto,
  ): Promise<WebResponse<RegisterResponseDto>> {
    const result = await this.authService.register(request);
    return { data: result };
  }

  @Public()
  @Post('/login')
  @HttpCode(200)
  async login(
    @Body() request: LoginRequestDto,
  ): Promise<WebResponse<LoginResponseDto>> {
    const result = await this.authService.login(request);
    return { data: result };
  }

  @Delete('/logout')
  @HttpCode(204)
  async logout(@Req() request: AuthDto): Promise<WebResponse<boolean>> {
    const userId = request.user.sub;
    const result = await this.authService.logout(userId);
    return { data: result };
  }
}
