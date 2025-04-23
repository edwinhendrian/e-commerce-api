import { Body, Controller, HttpCode, Post, Req } from '@nestjs/common';
import { OrderService } from './order.service';
// import { Roles } from 'src/common/decorators/roles.decorator';
import { WebResponse } from 'src/common/web-response';
import {
  CreateOrderRequestDto,
  CreateOrderResponseDto,
} from './dto/create-order.dto';
import { AuthDto } from 'src/auth/dto/auth.dto';

@Controller('/api/orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('/')
  @HttpCode(201)
  async createOrder(
    @Req() request: AuthDto,
    @Body() requestBody: CreateOrderRequestDto,
  ): Promise<WebResponse<CreateOrderResponseDto>> {
    const userId = request.user.sub;
    const result = await this.orderService.createOrder(userId, requestBody);
    return { data: result };
  }
}
