import { Injectable } from '@nestjs/common';
import * as midtrans from 'midtrans-client';

@Injectable()
export class MidtransService {
  private snap: midtrans.Snap;
  constructor() {
    this.snap = new midtrans.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });
  }

  async createTransaction(order: {
    orderId: string;
    grossAmount: number;
    customer: {
      name: string;
      email: string;
      phone?: string;
    };
  }) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.snap.createTransaction({
      transaction_details: {
        order_id: order.orderId,
        gross_amount: order.grossAmount,
      },
      customer_required: true,
      customer_details: {
        first_name: order.customer.name,
        email: order.customer.email,
        phone: order.customer.phone ? order.customer.phone : undefined,
      },
      customer_details_required_fields: ['first_name', 'email'],
    });
  }

  async parseNotification(body: any) {
    const coreApi = new midtrans.coreApi({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await coreApi.transaction.notification(body);
  }
}
