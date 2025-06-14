import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { WebResponse } from 'src/common/web-response';
import {
  CreateOrderRequestDto,
  CreateOrderResponseDto,
} from './dto/create-order.dto';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { GetOrderResponseDto } from './dto/get-order.dto';
import {
  UpdateOrderResponseDto,
  UpdateOrderStatusRequestDto,
} from './dto/update-order.dto';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';

@Controller('/api/orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('/')
  @HttpCode(201)
  @ApiBearerAuth()
  @ApiResponse({ status: 201, type: CreateOrderResponseDto })
  async createOrder(
    @User() user: AuthDto,
    @Body() requestBody: CreateOrderRequestDto,
  ): Promise<WebResponse<CreateOrderResponseDto>> {
    const userId = user.sub;
    const result = await this.orderService.createOrder(userId, requestBody);
    return { data: result };
  }

  @Get('/')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: GetOrderResponseDto, isArray: true })
  async getAll(
    @User() user: AuthDto,
  ): Promise<WebResponse<GetOrderResponseDto[]>> {
    const userId = user.sub;
    const result = await this.orderService.getAllOrders(userId);
    return { data: result };
  }

  @Get('/:id')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: GetOrderResponseDto })
  async getOrder(
    @User() user: AuthDto,
    @Param('id') id: string,
  ): Promise<WebResponse<GetOrderResponseDto>> {
    const userId = user.sub;
    const result = await this.orderService.getOrderById(userId, id);
    return { data: result };
  }

  @Patch('/:id/cancel')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: UpdateOrderResponseDto })
  async cancelOrder(
    @User() user: AuthDto,
    @Param('id') id: string,
  ): Promise<WebResponse<UpdateOrderResponseDto>> {
    const userId = user.sub;
    const result = await this.orderService.cancelOrder(userId, id);
    return { data: result };
  }

  @Patch('/:id/status')
  @HttpCode(200)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: UpdateOrderResponseDto })
  async updateOrderStatus(
    @User() user: AuthDto,
    @Param('id') id: string,
    @Body() requestBody: UpdateOrderStatusRequestDto,
  ): Promise<WebResponse<UpdateOrderResponseDto>> {
    const userId = user.sub;
    const result = await this.orderService.updateOrderStatus(
      userId,
      id,
      requestBody,
    );
    return { data: result };
  }
}
