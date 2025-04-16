import { Body, Controller, Get, HttpCode, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import {
  UpdateUserRequestDto,
  UpdateUserResponseDto,
} from './dto/update-user.dto';
import { WebResponse } from 'src/common/web-response';

@Controller('/api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/')
  @HttpCode(200)
  @Roles(['ADMIN'])
  async getAll() {
    // TODO: Define a proper response type
    const result = await this.userService.getAllUsers();
    return { data: result };
  }

  @Get('/:id')
  @HttpCode(200)
  @Roles(['ADMIN'])
  async getUser(@Param('id') id: string) {
    // TODO: Define a proper response type
    const result = await this.userService.getUserById(id);
    return { data: result };
  }

  @Patch('/:id')
  @HttpCode(200)
  @Roles(['ADMIN'])
  async updateUser(
    @Param('id') id: string,
    @Body() request: UpdateUserRequestDto,
  ): Promise<WebResponse<UpdateUserResponseDto>> {
    const result = await this.userService.updateUserById(id, request);
    return { data: result };
  }
}
