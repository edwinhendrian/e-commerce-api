import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { Logger } from 'winston';
import {
  UpdateUserRequestDto,
  UpdateUserResponseDto,
} from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { UserValidation } from './user.validation';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private validationService: ValidationService,
    private prismaService: PrismaService,
  ) {}

  async getAllUsers(): Promise<any> {
    // TODO: Define a proper return type
    this.logger.debug('Fetching all users');

    const users = await this.prismaService.user.findMany({});

    return users;
  }

  async getUserById(userId: string): Promise<any> {
    // TODO: Define a proper return type
    this.logger.debug('Fetching user by ID', { userId });

    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    return user;
  }

  async updateUserById(
    userId: string,
    request: UpdateUserRequestDto,
  ): Promise<UpdateUserResponseDto> {
    this.logger.debug('Updating user by ID', { userId, request });
    const updateRequest = this.validationService.validate(
      UserValidation.UPDATE_USER,
      request,
    );

    // TODO: Check if user exists

    const data: Partial<User> = {};
    if (updateRequest.email) {
      data.email = updateRequest.email;
    }

    if (updateRequest.phone) {
      data.phone = updateRequest.phone;
    }

    if (updateRequest.name) {
      data.name = updateRequest.name;
    }

    if (updateRequest.password) {
      if (updateRequest.password != updateRequest.confirmPassword) {
        throw new HttpException('Passwords do not match', 400);
      }
      data.password = await bcrypt.hash(updateRequest.password, 10);
    }

    const result = await this.prismaService.user.update({
      where: { id: userId },
      data,
    });

    return {
      email: result.email,
      phone: result.phone,
      name: result.name,
    };
  }
}
