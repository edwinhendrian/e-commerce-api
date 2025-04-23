import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { Logger } from 'winston';
import { AddCartRequestDto, AddCartResponseDto } from './dto/add-cart.dto';
import { CartValidation } from './cart.validation';
import { GetCartResponseDto } from './dto/get-cart.dto';
import {
  UpdateItemQuantityRequestDto,
  UpdateItemQuantityResponseDto,
} from './dto/update-cart-dto';

@Injectable()
export class CartService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private validationService: ValidationService,
    private prismaService: PrismaService,
  ) {}

  async addItemToCart(
    userId: string,
    request: AddCartRequestDto,
  ): Promise<AddCartResponseDto> {
    this.logger.debug('Adding item to cart', { userId, request });
    const addRequest = this.validationService.validate(
      CartValidation.ADD_CART,
      request,
    );

    const cart = await this.prismaService.cart.upsert({
      where: { user_id: userId },
      update: {},
      create: { user_id: userId },
    });

    const cartItem = await this.prismaService.cartItem.upsert({
      where: {
        cart_id_product_id: {
          cart_id: cart.id,
          product_id: addRequest.productId,
        },
      },
      update: {
        quantity: { increment: addRequest.quantity },
      },
      create: {
        cart_id: cart.id,
        product_id: addRequest.productId,
        quantity: addRequest.quantity,
      },
    });

    return {
      id: cartItem.id,
      cartId: cartItem.cart_id,
      productId: cartItem.product_id,
      quantity: cartItem.quantity,
      createdAt: cartItem.created_at,
    };
  }

  async getCart(userId: string): Promise<GetCartResponseDto> {
    this.logger.debug('Fetching cart items', { userId });

    const cart = await this.prismaService.cart.upsert({
      where: { user_id: userId },
      update: {},
      create: { user_id: userId },
      select: {
        id: true,
        user_id: true,
        items: {
          select: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                stock: true,
                images: {
                  select: {
                    image_url: true,
                  },
                },
              },
            },
            quantity: true,
          },
        },
      },
    });

    return {
      id: cart.id,
      userId: cart.user_id,
      items: cart.items.map((item) => {
        return {
          id: item.product.id,
          name: item.product.name,
          price: Number(item.product.price),
          stock: item.product.stock,
          images: item.product.images.map(
            (image) => (image as { image_url: string }).image_url,
          ),
          quantity: item.quantity,
        };
      }),
    };
  }

  async updateItemQuantity(
    userId: string,
    productId: string,
    request: UpdateItemQuantityRequestDto,
  ): Promise<UpdateItemQuantityResponseDto> {
    this.logger.debug('Updating item quantity in cart', {
      userId,
      productId,
      request,
    });
    const updateRequest = this.validationService.validate(
      CartValidation.UPDATE_ITEM,
      request,
    );

    const cart = await this.prismaService.cart.findUnique({
      where: { user_id: userId },
    });
    if (!cart) {
      throw new HttpException('Cart not found', 404);
    }

    const cartItem = await this.prismaService.cartItem.upsert({
      where: {
        cart_id_product_id: {
          cart_id: cart.id,
          product_id: productId,
        },
      },
      update: {
        quantity: updateRequest.quantity,
      },
      create: {
        cart_id: cart.id,
        product_id: productId,
        quantity: updateRequest.quantity,
      },
    });

    return {
      id: cartItem.id,
      cartId: cartItem.cart_id,
      productId: cartItem.product_id,
      quantity: cartItem.quantity,
      createdAt: cartItem.created_at,
    };
  }

  async deleteItemFromCart(
    userId: string,
    productId: string,
  ): Promise<boolean> {
    this.logger.debug('Deleting item from cart', { userId, productId });

    const cart = await this.prismaService.cart.findUnique({
      where: { user_id: userId },
    });
    if (!cart) {
      throw new HttpException('Cart not found', 404);
    }

    await this.prismaService.cartItem.delete({
      where: {
        cart_id_product_id: { cart_id: cart.id, product_id: productId },
      },
    });

    return true;
  }

  async deleteItemsFromCart(
    userId: string,
    productIds: string[],
  ): Promise<boolean> {
    this.logger.debug('Deleting items from cart', { userId, productIds });

    const cart = await this.prismaService.cart.findUnique({
      where: { user_id: userId },
    });
    if (!cart) {
      throw new HttpException('Cart not found', 404);
    }

    const ids = productIds.map((s) => {
      return { cart_id: cart.id, product_id: s };
    });

    for (const id of ids) {
      await this.prismaService.cartItem.delete({
        where: { cart_id_product_id: id },
      });
    }

    return true;
  }
}
