import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import {
  AvatarUploadRequestDto,
  UpdateAvatarResponseDto,
  UpdateUserRequestDto,
  UpdateUserResponseDto,
} from './dto/update-user.dto';
import { WebResponse } from 'src/common/web-response';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/multer.config';
import { GetUserResponseDto } from './dto/get-user.dto';
import { AuthDto } from 'src/auth/dto/auth.dto';
import {
  CreateUserAddressRequestDto,
  CreateUserAddressResponseDto,
} from './dto/create-user-address.dto';
import { GetUserAddressResponseDto } from './dto/get-user-address.dto';
import {
  UpdateUserAddressRequestDto,
  UpdateUserAddressResponseDto,
} from './dto/update-user-address.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
} from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';

@Controller('/api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/addresses')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: CreateUserAddressResponseDto })
  async createUserAddress(
    @User() user: AuthDto,
    @Body() requestBody: CreateUserAddressRequestDto,
  ): Promise<WebResponse<CreateUserAddressResponseDto>> {
    const userId = user.sub;
    const result = await this.userService.createUserAddress(
      userId,
      requestBody,
    );
    return { data: result };
  }

  @Get('/addresses')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: GetUserAddressResponseDto, isArray: true })
  async getAllUserAddresses(
    @User() user: AuthDto,
  ): Promise<WebResponse<GetUserAddressResponseDto[]>> {
    const userId = user.sub;
    const result = await this.userService.getUserAddresses(userId);
    return { data: result };
  }

  @Get('/addresses/:id')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: GetUserAddressResponseDto })
  async getUserAddress(
    @Param('id') id: string,
  ): Promise<WebResponse<GetUserAddressResponseDto>> {
    const result = await this.userService.getUserAddressById(id);
    return { data: result };
  }

  @Patch('/addresses/:id')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: UpdateUserAddressResponseDto })
  async updateUserAddress(
    @User() user: AuthDto,
    @Param('id') id: string,
    @Body() requestBody: UpdateUserAddressRequestDto,
  ): Promise<WebResponse<UpdateUserAddressResponseDto>> {
    const userId = user.sub;
    const result = await this.userService.updateUserAddressById(
      userId,
      id,
      requestBody,
    );
    return { data: result };
  }

  @Patch('/addresses/:id/primary')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: UpdateUserAddressResponseDto })
  async setUserAddressPrimary(
    @User() user: AuthDto,
    @Param('id') id: string,
  ): Promise<WebResponse<UpdateUserAddressResponseDto>> {
    const userId = user.sub;
    const result = await this.userService.setUserAddressPrimary(userId, id);
    return { data: result };
  }

  @Delete('/addresses/:id')
  @HttpCode(204)
  @ApiBearerAuth()
  async deleteUserAddress(
    @User() user: AuthDto,
    @Param('id') id: string,
  ): Promise<WebResponse<boolean>> {
    const userId = user.sub;
    const result = await this.userService.deleteUserAddressById(userId, id);
    return { data: result };
  }

  @Get('/')
  @HttpCode(200)
  @Roles(['ADMIN'])
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: GetUserResponseDto, isArray: true })
  async getAll(): Promise<WebResponse<GetUserResponseDto[]>> {
    const result = await this.userService.getAllUsers();
    return { data: result };
  }

  @Get('/:id')
  @HttpCode(200)
  @Roles(['ADMIN'])
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: GetUserResponseDto })
  async getUser(
    @Param('id') id: string,
  ): Promise<WebResponse<GetUserResponseDto>> {
    const result = await this.userService.getUserById(id);
    return { data: result };
  }

  @Patch('/:id')
  @HttpCode(200)
  @Roles(['ADMIN'])
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: UpdateUserResponseDto })
  async updateUser(
    @Param('id') id: string,
    @Body() request: UpdateUserRequestDto,
  ): Promise<WebResponse<UpdateUserResponseDto>> {
    const result = await this.userService.updateUserById(id, request);
    return { data: result };
  }

  @Put('/:id/avatar')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file', multerOptions))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: AvatarUploadRequestDto })
  async updateAvatar(
    @Param('id') id: string,
    @UploadedFile('file') file: Express.Multer.File,
  ): Promise<WebResponse<UpdateAvatarResponseDto>> {
    const result = await this.userService.updateAvatar(id, file);
    return { data: result };
  }
}
