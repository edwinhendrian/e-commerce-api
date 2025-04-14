import { HttpException, Inject, Injectable } from '@nestjs/common';
import { LoginRequestDto, LoginResponseDto } from './dto/login.dto';
import { RegisterRequestDto, RegisterResponseDto } from './dto/register.dto';
import { ValidationService } from 'src/common/validation.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from 'src/common/prisma.service';
import { AuthValidation } from './auth.validation';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(request: RegisterRequestDto): Promise<RegisterResponseDto> {
    this.logger.info(`Registering new user ${JSON.stringify(request)}`);
    const registerRequest = this.validationService.validate(
      AuthValidation.REGISTER,
      request,
    );

    const userCount = await this.prismaService.user.count({
      where: {
        email: registerRequest.email,
      },
    });

    if (userCount != 0) {
      this.logger.error(
        `User with email ${registerRequest.email} already exists`,
      );
      throw new HttpException('User already exists', 409);
    }

    if (registerRequest.password != registerRequest.confirmPassword) {
      throw new HttpException('Passwords do not match', 400);
    }

    const user = await this.prismaService.user.create({
      data: {
        name: registerRequest.name,
        email: registerRequest.email,
        password: await bcrypt.hash(registerRequest.password, 10),
      },
    });

    return {
      name: user.name,
      email: user.email,
    };
  }

  async login(request: LoginRequestDto): Promise<LoginResponseDto> {
    this.logger.info(`Logging in user ${JSON.stringify(request)}`);
    const loginRequest = this.validationService.validate(
      AuthValidation.LOGIN,
      request,
    );

    let user = await this.prismaService.user.findUnique({
      where: {
        email: loginRequest.email,
      },
    });

    if (!user) {
      throw new HttpException('Email or password is incorrect', 401);
    }

    const isPasswordValid = await bcrypt.compare(
      loginRequest.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('Email or password is incorrect', 401);
    }

    const token = await this.jwtService.signAsync({ sub: user.id });

    user = await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        token,
        last_login: new Date(),
      },
    });

    return {
      name: user.name,
      token: user.token,
    };
  }
}
