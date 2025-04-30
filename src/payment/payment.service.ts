import { HttpException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { MidtransService } from './midtrans.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import * as crypto from 'crypto';
import {
  InitiatePaymentResponseDto,
  MidtransNotificationRequestDto,
} from './dto/payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private midtransService: MidtransService,
  ) {}

  async initiatePayment(
    userId: string,
    orderId: string,
  ): Promise<InitiatePaymentResponseDto> {
    this.logger.debug('Initiating payment', { userId, orderId });

    const order = await this.prismaService.order.findUnique({
      where: { id: orderId, user_id: userId },
      include: { user: true },
    });

    if (!order) {
      this.logger.error(
        `Order with ID ${orderId} not found or not owned by user`,
      );
      throw new HttpException('Order not found', 404);
    }

    const midtransResponse = await this.midtransService.createTransaction({
      orderId: order.order_number,
      grossAmount: Number(order.total_amount),
      customer: {
        name: order.user.name,
        email: order.user.email,
        phone: order.user.phone == null ? undefined : order.user.phone,
      },
    });

    return {
      token: midtransResponse.token,
      redirectUrl: midtransResponse.redirect_url,
    };
  }

  async handleMidtransNotification(request: MidtransNotificationRequestDto) {
    this.logger.debug('handle notification payment', { request });

    const isValid = this.isSignatureValid({
      order_id: request.order_id,
      status_code: request.status_code,
      gross_amount: request.gross_amount,
      signature_key: request.signature_key,
      server_key: process.env.MIDTRANS_SERVER_KEY,
    });

    if (!isValid) {
      this.logger.error(`Invalid midtrans signature`);
      throw new HttpException('Forbidden', 403);
    }

    const result = await this.midtransService.parseNotification(request);

    const order = await this.prismaService.order.findFirst({
      where: { order_number: result.order_id },
      include: { payment: true },
    });

    if (!order) {
      this.logger.error(`Order with order number ${result.order_id} not found`);
      throw new HttpException('Order not found', 404);
    }

    const statusMap: Record<
      string,
      { order: OrderStatus; payment: PaymentStatus }
    > = {
      settlement: { order: 'PAID', payment: 'PAID' },
      capture: { order: 'PAID', payment: 'PAID' },
      expire: { order: 'CANCELLED', payment: 'EXPIRED' },
      cancel: { order: 'CANCELLED', payment: 'CANCELLED' },
      deny: { order: 'PENDING', payment: 'FAILED' },
      pending: { order: 'PENDING', payment: 'UNPAID' },
    };

    const paymentData = {
      order_id: order.id,
      midtrans_order_id: result.order_id,
      payment_type: result.payment_type,
      transaction_status: result.transaction_status,
      transaction_time: result.transaction_time,
      gross_amount: new Decimal(result.gross_amount),
      transaction_id: result.transaction_id,
    };

    if (order.payment) {
      await this.prismaService.payment.update({
        where: { id: order.payment.id },
        data: paymentData,
      });
    } else {
      await this.prismaService.payment.create({
        data: paymentData,
      });
    }

    const status = statusMap[result.transaction_status];
    await this.prismaService.order.update({
      where: { id: order.id },
      data: {
        status: status.order,
        payment_status: status.payment,
      },
    });

    return true;
  }

  private isSignatureValid({
    order_id,
    status_code,
    gross_amount,
    signature_key,
    server_key,
  }: {
    order_id: string;
    status_code: string;
    gross_amount: string;
    signature_key: string;
    server_key: string | undefined;
  }): boolean {
    const rawSignature = order_id + status_code + gross_amount + server_key;
    const hash = crypto.createHash('sha512').update(rawSignature).digest('hex');
    return hash === signature_key;
  }
}
