import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { PromoService } from 'src/promo/promo.service';
import { Logger } from 'winston';
import {
  CreateOrderRequestDto,
  CreateOrderResponseDto,
} from './dto/create-order.dto';
import { OrderValidation } from './order.validation';
import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { CartService } from 'src/cart/cart.service';
import { GetOrderResponseDto } from './dto/get-order.dto';
import {
  UpdateOrderResponseDto,
  UpdateOrderStatusRequestDto,
} from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private validationService: ValidationService,
    private prismaService: PrismaService,
    private promoService: PromoService,
    private cartService: CartService,
  ) {}

  async createOrder(
    userId: string,
    request: CreateOrderRequestDto,
  ): Promise<CreateOrderResponseDto> {
    this.logger.debug('Creating order', { userId, request });
    const createRequest: CreateOrderRequestDto =
      this.validationService.validate(OrderValidation.CREATE_ORDER, request);

    const { items, address, shippingCost, code } = createRequest;

    const products = await this.prismaService.product.findMany({
      where: { id: { in: items.map((item) => item.productId) } },
    });

    let subTotal = new Decimal(0);
    const orderItems: Prisma.OrderItemCreateWithoutOrderInput[] = [];

    for (const item of items) {
      const product = products.find((o) => o.id == item.productId);
      if (!product) {
        this.logger.error(`Product with ID ${item.productId} not found`);
        throw new HttpException('Product not found', 404);
      }
      if (product.stock < item.quantity) {
        this.logger.error(
          `Insufficient stock for product with ID ${item.productId}`,
        );
        throw new HttpException('Insufficient stock', 404);
      }

      const price = product.price;
      const priceTotal = price.mul(item.quantity);
      subTotal = subTotal.add(priceTotal);

      orderItems.push({
        product_id: item.productId,
        quantity: item.quantity,
        price,
      });
    }

    let promoDiscount = new Decimal(0);
    if (code) {
      promoDiscount = await this.promoService.validatePromo(code, subTotal);
      subTotal.minus(promoDiscount);
    }

    const shipping = new Decimal(shippingCost);
    const totalAmount = subTotal.plus(shipping);

    const snapshot = await this.prismaService.orderAddressSnapshot.create({
      data: {
        recipient_name: address.recipientName,
        phone_number: address.phoneNumber,
        address_line_1: address.addressLine1,
        address_line_2: address.addressLine2,
        sub_district: address.subDistrict,
        district: address.district,
        city: address.city,
        province: address.province,
        country: address.country,
        postal_code: address.postalCode,
      },
    });

    const orderNumber = `ORD-${Date.now()}`;

    const order = await this.prismaService.order.create({
      data: {
        user_id: userId,
        order_number: orderNumber,
        total_amount: totalAmount,
        shipping_cost: shipping,
        promo_discount: promoDiscount,
        snapshot_id: snapshot.id,
        order_items: {
          create: orderItems,
        },
      },
      include: {
        order_address_snapshot: true,
        order_items: true,
      },
    });

    await this.cartService.deleteItemsFromCart(
      userId,
      items.map((item) => item.productId),
    );

    return {
      id: order.id,
      userId: order.user_id,
      orderNumber: order.order_number,
      totalAmount: Number(order.total_amount),
      shippingCost: Number(order.shipping_cost),
      promoDiscount: Number(order.promo_discount),
      status: order.status,
      paymentStatus: order.payment_status,
      orderAddressSnapshot: {
        id: order.order_address_snapshot.id,
        recipientName: order.order_address_snapshot.recipient_name,
        phoneNumber: order.order_address_snapshot.phone_number,
        addressLine1: order.order_address_snapshot.address_line_1,
        addressLine2: order.order_address_snapshot.address_line_2,
        subDistrict: order.order_address_snapshot.sub_district,
        district: order.order_address_snapshot.district,
        city: order.order_address_snapshot.city,
        province: order.order_address_snapshot.province,
        country: order.order_address_snapshot.country,
        postalCode: order.order_address_snapshot.postal_code,
      },
      orderItems: order.order_items.map((item) => {
        return {
          id: item.id,
          order_id: item.order_id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: Number(item.price),
        };
      }),
      createdAt: order.created_at,
    };
  }

  async getAllOrders(userId: string): Promise<GetOrderResponseDto[]> {
    this.logger.debug('Fetching all orders', { userId });

    const orders = await this.prismaService.order.findMany({
      where: { user_id: userId },
      include: {
        order_address_snapshot: true,
        order_items: true,
      },
    });

    return orders.map((order) => {
      return {
        id: order.id,
        userId: order.user_id,
        orderNumber: order.order_number,
        totalAmount: Number(order.total_amount),
        shippingCost: Number(order.shipping_cost),
        promoDiscount: Number(order.promo_discount),
        status: order.status,
        paymentStatus: order.payment_status,
        orderAddressSnapshot: {
          id: order.order_address_snapshot.id,
          recipientName: order.order_address_snapshot.recipient_name,
          phoneNumber: order.order_address_snapshot.phone_number,
          addressLine1: order.order_address_snapshot.address_line_1,
          addressLine2: order.order_address_snapshot.address_line_2,
          subDistrict: order.order_address_snapshot.sub_district,
          district: order.order_address_snapshot.district,
          city: order.order_address_snapshot.city,
          province: order.order_address_snapshot.province,
          country: order.order_address_snapshot.country,
          postalCode: order.order_address_snapshot.postal_code,
        },
        orderItems: order.order_items.map((item) => {
          return {
            id: item.id,
            order_id: item.order_id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: Number(item.price),
          };
        }),
        createdAt: order.created_at,
      };
    });
  }

  async getOrderById(
    userId: string,
    orderId: string,
  ): Promise<GetOrderResponseDto> {
    this.logger.debug('Fetching order by ID', { userId, orderId });

    const order = await this.prismaService.order.findUnique({
      where: { id: orderId, user_id: userId },
      include: {
        order_address_snapshot: true,
        order_items: true,
      },
    });

    if (!order) {
      this.logger.error(
        `Order with ID ${orderId} not found or not owned by user`,
      );
      throw new HttpException('Order not found', 404);
    }

    return {
      id: order.id,
      userId: order.user_id,
      orderNumber: order.order_number,
      totalAmount: Number(order.total_amount),
      shippingCost: Number(order.shipping_cost),
      promoDiscount: Number(order.promo_discount),
      status: order.status,
      paymentStatus: order.payment_status,
      orderAddressSnapshot: {
        id: order.order_address_snapshot.id,
        recipientName: order.order_address_snapshot.recipient_name,
        phoneNumber: order.order_address_snapshot.phone_number,
        addressLine1: order.order_address_snapshot.address_line_1,
        addressLine2: order.order_address_snapshot.address_line_2,
        subDistrict: order.order_address_snapshot.sub_district,
        district: order.order_address_snapshot.district,
        city: order.order_address_snapshot.city,
        province: order.order_address_snapshot.province,
        country: order.order_address_snapshot.country,
        postalCode: order.order_address_snapshot.postal_code,
      },
      orderItems: order.order_items.map((item) => {
        return {
          id: item.id,
          order_id: item.order_id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: Number(item.price),
        };
      }),
      createdAt: order.created_at,
    };
  }

  async cancelOrder(
    userId: string,
    orderId: string,
  ): Promise<UpdateOrderResponseDto> {
    this.logger.debug('Cancelling order', { userId, orderId });

    const order = await this.prismaService.order.findUnique({
      where: { id: orderId, user_id: userId },
    });

    if (!order) {
      this.logger.error(
        `Order with ID ${orderId} not found or not owned by user`,
      );
      throw new HttpException('Order not found', 404);
    }

    const result = await this.prismaService.order.update({
      where: { id: order.id },
      data: {
        status: 'CANCELLED',
      },
    });

    return {
      id: result.id,
      userId: result.user_id,
      orderNumber: result.order_number,
      totalAmount: Number(result.total_amount),
      shippingCost: Number(result.shipping_cost),
      promoDiscount: Number(result.promo_discount),
      status: result.status,
      paymentStatus: result.payment_status,
      createdAt: result.created_at,
    };
  }

  async updateOrderStatus(
    userId: string,
    orderId: string,
    request: UpdateOrderStatusRequestDto,
  ): Promise<UpdateOrderResponseDto> {
    this.logger.debug('Updating order status', { userId, orderId, request });
    const updateRequest = this.validationService.validate(
      OrderValidation.UPDATE_ORDER_STATUS,
      request,
    );

    const order = await this.prismaService.order.findUnique({
      where: { id: orderId, user_id: userId },
    });

    if (!order) {
      this.logger.error(
        `Order with ID ${orderId} not found or not owned by user`,
      );
      throw new HttpException('Order not found', 404);
    }

    const result = await this.prismaService.order.update({
      where: { id: order.id },
      data: {
        status: updateRequest.status,
      },
    });

    return {
      id: result.id,
      userId: result.user_id,
      orderNumber: result.order_number,
      totalAmount: Number(result.total_amount),
      shippingCost: Number(result.shipping_cost),
      promoDiscount: Number(result.promo_discount),
      status: result.status,
      paymentStatus: result.payment_status,
      createdAt: result.created_at,
    };
  }
}
