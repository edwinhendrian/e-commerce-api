import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { WebResponse } from 'src/common/web-response';
import { AddCartRequestDto, AddCartResponseDto } from './dto/add-cart.dto';
import { GetCartResponseDto } from './dto/get-cart.dto';
import { UpdateItemQuantityResponseDto } from './dto/update-cart-dto';
import { AuthDto } from 'src/auth/dto/auth.dto';

@Controller('/api/cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Post('/items')
  @HttpCode(201)
  async addItem(
    @Req() request: AuthDto,
    @Body() requestBody: AddCartRequestDto,
  ): Promise<WebResponse<AddCartResponseDto>> {
    const userId = request.user.sub;
    const result = await this.cartService.addItemToCart(userId, requestBody);
    return { data: result };
  }

  @Get('/')
  @HttpCode(200)
  async getCart(
    @Req() request: AuthDto,
  ): Promise<WebResponse<GetCartResponseDto>> {
    const userId = request.user.sub;
    const result = await this.cartService.getCart(userId);
    return { data: result };
  }

  @Put('/items/:id')
  @HttpCode(200)
  async updateItemQuantity(
    @Req() request: AuthDto,
    @Param('id') id: string,
    @Body() requestBody: UpdateItemQuantityResponseDto,
  ): Promise<WebResponse<UpdateItemQuantityResponseDto>> {
    const userId = request.user.sub;
    const result = await this.cartService.updateItemQuantity(
      userId,
      id,
      requestBody,
    );
    return { data: result };
  }

  @Delete('/items/:id')
  @HttpCode(204)
  async deleteItem(
    @Req() request: AuthDto,
    @Param('id') id: string,
  ): Promise<WebResponse<boolean>> {
    const userId = request.user.sub;
    const result = await this.cartService.deleteItemFromCart(userId, id);
    return { data: result };
  }
}
