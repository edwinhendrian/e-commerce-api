import { Body, Controller, HttpCode, Param, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { WebResponse } from 'src/common/web-response';
import { AuthDto } from 'src/auth/dto/auth.dto';
import {
  InitiatePaymentResponseDto,
  MidtransNotificationRequestDto,
} from './dto/payment.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';

@Controller('/api/payments')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('/:id/initiate')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: InitiatePaymentResponseDto })
  async initiatePayment(
    @User() user: AuthDto,
    @Param('id') id: string,
  ): Promise<WebResponse<InitiatePaymentResponseDto>> {
    const userId = user.sub;
    const result = await this.paymentService.initiatePayment(userId, id);
    return { data: result };
  }

  @Public()
  @Post('/midtrans-notification')
  @HttpCode(200)
  async midtransNotification(
    @Body() request: MidtransNotificationRequestDto,
  ): Promise<WebResponse<boolean>> {
    const result =
      await this.paymentService.handleMidtransNotification(request);
    return { data: result };
  }

  // TODO: get payment
}
