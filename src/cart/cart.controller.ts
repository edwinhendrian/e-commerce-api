import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { WebResponse } from 'src/common/web-response';
import { AddCartRequestDto, AddCartResponseDto } from './dto/add-cart.dto';
import { GetCartResponseDto } from './dto/get-cart.dto';
import { UpdateItemQuantityResponseDto } from './dto/update-cart-dto';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';

@Controller('/api/cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Post('/items')
  @HttpCode(201)
  @ApiBearerAuth()
  @ApiResponse({ status: 201, type: AddCartResponseDto })
  async addItem(
    @User() user: AuthDto,
    @Body() requestBody: AddCartRequestDto,
  ): Promise<WebResponse<AddCartResponseDto>> {
    const userId = user.sub;
    const result = await this.cartService.addItemToCart(userId, requestBody);
    return { data: result };
  }

  @Get('/')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: GetCartResponseDto })
  async getCart(
    @User() user: AuthDto,
  ): Promise<WebResponse<GetCartResponseDto>> {
    const userId = user.sub;
    const result = await this.cartService.getCart(userId);
    return { data: result };
  }

  @Put('/items/:id')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: UpdateItemQuantityResponseDto })
  async updateItemQuantity(
    @User() user: AuthDto,
    @Param('id') id: string,
    @Body() requestBody: UpdateItemQuantityResponseDto,
  ): Promise<WebResponse<UpdateItemQuantityResponseDto>> {
    const userId = user.sub;
    const result = await this.cartService.updateItemQuantity(
      userId,
      id,
      requestBody,
    );
    return { data: result };
  }

  @Delete('/items/:id')
  @HttpCode(204)
  @ApiBearerAuth()
  async deleteItem(
    @User() user: AuthDto,
    @Param('id') id: string,
  ): Promise<WebResponse<boolean>> {
    const userId = user.sub;
    const result = await this.cartService.deleteItemFromCart(userId, id);
    return { data: result };
  }
}
