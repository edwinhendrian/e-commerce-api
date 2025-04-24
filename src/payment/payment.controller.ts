import { Body, Controller, HttpCode, Param, Post, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { WebResponse } from 'src/common/web-response';
import { AuthDto } from 'src/auth/dto/auth.dto';
import {
  InitiatePaymentResponseDto,
  midtransNotificationRequestDto,
} from './dto/payment.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('/api/payments')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('/:id/initiate')
  @HttpCode(200)
  async initiatePayment(
    @Req() request: AuthDto,
    @Param('id') id: string,
  ): Promise<WebResponse<InitiatePaymentResponseDto>> {
    const userId = request.user.sub;
    const result = await this.paymentService.initiatePayment(userId, id);
    return { data: result };
  }

  @Public()
  @Post('/midtrans-notification')
  @HttpCode(200)
  async midtransNotification(
    @Body() request: midtransNotificationRequestDto,
  ): Promise<WebResponse<boolean>> {
    const result =
      await this.paymentService.handleMidtransNotification(request);
    return { data: result };
  }
}
