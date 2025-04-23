import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { Logger } from 'winston';
import {
  UpdateAvatarResponseDto,
  UpdateUserRequestDto,
  UpdateUserResponseDto,
} from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { UserValidation } from './user.validation';
import { User, UserAddress } from '@prisma/client';
import { UploadService } from 'src/common/upload.service';
import { GetUserAddressResponseDto } from './dto/get-user-address.dto';
import {
  CreateUserAddressRequestDto,
  CreateUserAddressResponseDto,
} from './dto/create-user-address.dto';
import {
  UpdateUserAddressRequestDto,
  UpdateUserAddressResponseDto,
} from './dto/update-user-address.dto';
import { GetUserResponseDto } from './dto/get-user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private validationService: ValidationService,
    private prismaService: PrismaService,
    private uploadService: UploadService,
  ) {}

  async getAllUsers(): Promise<GetUserResponseDto[]> {
    this.logger.debug('Fetching all users');

    const users = await this.prismaService.user.findMany({});

    return users.map((user) => {
      return {
        id: user.id,
        email: user.email,
        emailValidated: user.email_validated,
        phone: user.phone,
        phoneValidated: user.phone_validated,
        role: user.role,
        name: user.name,
        avatarUrl: user.avatar_url,
        token: user.token,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        lastLogin: user.last_login,
      };
    });
  }

  async getUserById(userId: string): Promise<GetUserResponseDto> {
    this.logger.debug('Fetching user by ID', { userId });

    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      this.logger.error(`User with ID ${userId} not found`);
      throw new HttpException('User not found', 404);
    }

    return {
      id: user.id,
      email: user.email,
      emailValidated: user.email_validated,
      phone: user.phone,
      phoneValidated: user.phone_validated,
      role: user.role,
      name: user.name,
      avatarUrl: user.avatar_url,
      token: user.token,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      lastLogin: user.last_login,
    };
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

    const userCount = await this.prismaService.user.count({
      where: { id: userId },
    });

    if (userCount == 0) {
      this.logger.error(`User with ID ${userId} not found`);
      throw new HttpException('User not found', 404);
    }

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

  async updateAvatar(
    userId: string,
    file: Express.Multer.File,
  ): Promise<UpdateAvatarResponseDto> {
    this.logger.debug(`Updating user's avatar`, { userId, file });

    const userCount = await this.prismaService.user.count({
      where: { id: userId },
    });

    if (userCount == 0) {
      this.logger.error(`User with ID ${userId} not found`);
      throw new HttpException('User not found', 404);
    }

    // TODO: Delete old avatar if exists

    const avatar_url = await this.uploadService.uploadImage(file);
    if (!avatar_url) {
      throw new HttpException('Failed to upload avatar', 500);
    }

    const user = await this.prismaService.user.update({
      where: { id: userId },
      data: { avatar_url },
    });

    return {
      avatarUrl: user.avatar_url,
    };
  }

  async createUserAddress(
    userId: string,
    request: CreateUserAddressRequestDto,
  ): Promise<CreateUserAddressResponseDto> {
    this.logger.debug('Creating user address', { userId, request });
    const createRequest = this.validationService.validate(
      UserValidation.CREATE_USER_ADDRESS,
      request,
    );

    const userAddress = await this.prismaService.userAddress.create({
      data: {
        user_id: userId,
        recipient_name: createRequest.recipientName,
        phone_number: createRequest.phoneNumber,
        address_line_1: createRequest.addressLine1,
        address_line_2: createRequest.addressLine2
          ? createRequest.addressLine2
          : null,
        sub_district: createRequest.subDistrict,
        district: createRequest.district,
        city: createRequest.city,
        province: createRequest.province,
        country: createRequest.country,
        postal_code: createRequest.postalCode,
      },
    });

    return {
      id: userAddress.id,
      userId: userAddress.user_id,
      recipientName: userAddress.recipient_name,
      phoneNumber: userAddress.phone_number,
      addressLine1: userAddress.address_line_1,
      addressLine2: userAddress.address_line_2
        ? userAddress.address_line_2
        : null,
      subDistrict: userAddress.sub_district,
      district: userAddress.district,
      city: userAddress.city,
      province: userAddress.province,
      country: userAddress.country,
      postalCode: userAddress.postal_code,
      isPrimary: userAddress.is_primary,
      createdAt: userAddress.created_at,
    };
  }

  async getUserAddresses(userId: string): Promise<GetUserAddressResponseDto[]> {
    this.logger.debug(`Fetching user's addresses`, { userId });

    const userAddresses = await this.prismaService.userAddress.findMany({
      where: { user_id: userId },
    });

    return userAddresses.map((userAddress) => {
      return {
        id: userAddress.id,
        userId: userAddress.user_id,
        recipientName: userAddress.recipient_name,
        phoneNumber: userAddress.phone_number,
        addressLine1: userAddress.address_line_1,
        addressLine2: userAddress.address_line_2
          ? userAddress.address_line_2
          : null,
        subDistrict: userAddress.sub_district,
        district: userAddress.district,
        city: userAddress.city,
        province: userAddress.province,
        country: userAddress.country,
        postalCode: userAddress.postal_code,
        isPrimary: userAddress.is_primary,
        createdAt: userAddress.created_at,
      };
    });
  }

  async getUserAddressById(
    userAddressId: string,
  ): Promise<GetUserAddressResponseDto> {
    this.logger.debug('Fetching user address by ID', { userAddressId });

    const userAddress = await this.prismaService.userAddress.findUnique({
      where: { id: userAddressId },
    });

    if (!userAddress) {
      this.logger.error(`User address with ID ${userAddressId} not found`);
      throw new HttpException('User address not found', 404);
    }

    return {
      id: userAddress.id,
      userId: userAddress.user_id,
      recipientName: userAddress.recipient_name,
      phoneNumber: userAddress.phone_number,
      addressLine1: userAddress.address_line_1,
      addressLine2: userAddress.address_line_2
        ? userAddress.address_line_2
        : null,
      subDistrict: userAddress.sub_district,
      district: userAddress.district,
      city: userAddress.city,
      province: userAddress.province,
      country: userAddress.country,
      postalCode: userAddress.postal_code,
      isPrimary: userAddress.is_primary,
      createdAt: userAddress.created_at,
    };
  }

  async updateUserAddressById(
    userId: string,
    userAddressId: string,
    request: UpdateUserAddressRequestDto,
  ): Promise<UpdateUserAddressResponseDto> {
    this.logger.debug('Updating user address by ID', {
      userAddressId,
      request,
    });
    const updateRequest = this.validationService.validate(
      UserValidation.UPDATE_USER_ADDRESS,
      request,
    );

    const userAddress = await this.prismaService.userAddress.findUnique({
      where: { id: userAddressId },
    });

    if (!userAddress || userAddress.user_id != userId) {
      throw new HttpException(
        'User address not found or not owned by user',
        404,
      );
    }

    const data: Partial<UserAddress> = {};
    if (updateRequest.recipientName) {
      data.recipient_name = updateRequest.recipientName;
    }

    if (updateRequest.phoneNumber) {
      data.phone_number = updateRequest.phoneNumber;
    }

    if (updateRequest.addressLine1) {
      data.address_line_1 = updateRequest.addressLine1;
    }

    if (updateRequest.addressLine2) {
      data.address_line_2 = updateRequest.addressLine2;
    }

    if (updateRequest.subDistrict) {
      data.sub_district = updateRequest.subDistrict;
    }

    if (updateRequest.district) {
      data.district = updateRequest.district;
    }

    if (updateRequest.city) {
      data.city = updateRequest.city;
    }

    if (updateRequest.province) {
      data.province = updateRequest.province;
    }

    if (updateRequest.country) {
      data.country = updateRequest.country;
    }

    if (updateRequest.postalCode) {
      data.postal_code = updateRequest.postalCode;
    }

    if (updateRequest.isPrimary) {
      data.is_primary = updateRequest.isPrimary;

      if (data.is_primary == true) {
        await this.prismaService.userAddress.updateMany({
          where: { user_id: userId },
          data: { is_primary: false },
        });
      }
    }

    const result = await this.prismaService.userAddress.update({
      where: { id: userAddressId },
      data,
    });

    return {
      id: result.id,
      userId: result.user_id,
      recipientName: result.recipient_name,
      phoneNumber: result.phone_number,
      addressLine1: result.address_line_1,
      addressLine2: result.address_line_2 ? result.address_line_2 : null,
      subDistrict: result.sub_district,
      district: result.district,
      city: result.city,
      province: result.province,
      country: result.country,
      postalCode: result.postal_code,
      isPrimary: result.is_primary,
      createdAt: result.created_at,
    };
  }

  async setUserAddressPrimary(
    userId: string,
    userAddressId: string,
  ): Promise<UpdateUserAddressResponseDto> {
    this.logger.debug('Setting user address primary', {
      userId,
      userAddressId,
    });

    const userAddress = await this.prismaService.userAddress.findUnique({
      where: { id: userAddressId },
    });

    if (!userAddress || userAddress.user_id != userId) {
      throw new HttpException(
        'User address not found or not owned by user',
        404,
      );
    }

    await this.prismaService.userAddress.updateMany({
      where: { user_id: userId },
      data: { is_primary: false },
    });

    const result = await this.prismaService.userAddress.update({
      where: { id: userAddressId },
      data: { is_primary: true },
    });

    return {
      id: result.id,
      userId: result.user_id,
      recipientName: result.recipient_name,
      phoneNumber: result.phone_number,
      addressLine1: result.address_line_1,
      addressLine2: result.address_line_2 ? result.address_line_2 : null,
      subDistrict: result.sub_district,
      district: result.district,
      city: result.city,
      province: result.province,
      country: result.country,
      postalCode: result.postal_code,
      isPrimary: result.is_primary,
      createdAt: result.created_at,
    };
  }

  async deleteUserAddressById(
    userId: string,
    userAddressId: string,
  ): Promise<boolean> {
    this.logger.debug('Deleting user address by ID', { userAddressId });

    const userAddress = await this.prismaService.userAddress.findUnique({
      where: { id: userAddressId },
    });

    if (!userAddress || userAddress.user_id != userId) {
      throw new HttpException(
        'User address not found or not owned by user',
        404,
      );
    }

    await this.prismaService.userAddress.delete({
      where: { id: userAddressId },
    });

    return true;
  }
}
