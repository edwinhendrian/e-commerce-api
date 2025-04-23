import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { Logger } from 'winston';
import {
  CreatePromoRequestDto,
  CreatePromoResponseDto,
} from './dto/create-promo.dto';
import { PromoValidation } from './promo.validation';
import { GetPromoResponseDto } from './dto/get-promo.dto';
import { Promo } from '@prisma/client';
import {
  UpdatePromoRequestDto,
  UpdatePromoResponseDto,
} from './dto/update-promo.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class PromoService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private validationService: ValidationService,
    private prismaService: PrismaService,
  ) {}

  async createPromo(
    request: CreatePromoRequestDto,
  ): Promise<CreatePromoResponseDto> {
    this.logger.debug('Creating promo', { request });
    const createRequest = this.validationService.validate(
      PromoValidation.CREATE_PROMO,
      request,
    );

    const promoCount = await this.prismaService.promo.count({
      where: { code: createRequest.code },
    });
    if (promoCount != 0) {
      this.logger.error(`Promo with code ${createRequest.code} already exists`);
      throw new HttpException('Promo already exists', 409);
    }

    const promo = await this.prismaService.promo.create({
      data: {
        code: createRequest.code,
        description: createRequest.description,
        discount_type: createRequest.discountType,
        discount_value: createRequest.discountValue,
        max_discount: createRequest.maxDiscount,
        min_order_amount: createRequest.minOrderAmount,
        start_date: createRequest.startDate,
        end_date: createRequest.endDate,
      },
    });

    return {
      id: promo.id,
      code: promo.code,
      description: promo.description,
      discountType: promo.discount_type,
      discountValue: Number(promo.discount_value),
      maxDiscount: promo.max_discount
        ? Number(promo.max_discount)
        : promo.max_discount,
      minOrderAmount: promo.min_order_amount
        ? Number(promo.min_order_amount)
        : null,
      startDate: promo.start_date,
      endDate: promo.end_date,
      createdAt: promo.created_at,
      updatedAt: promo.updated_at,
    };
  }

  async getAllPromos(): Promise<GetPromoResponseDto[]> {
    this.logger.debug('Fetching all promos');

    const promos: Promo[] = await this.prismaService.promo.findMany();

    return promos.map((promo) => {
      return {
        id: promo.id,
        code: promo.code,
        description: promo.description,
        discountType: promo.discount_type,
        discountValue: Number(promo.discount_value),
        maxDiscount: promo.max_discount
          ? Number(promo.max_discount)
          : promo.max_discount,
        minOrderAmount: promo.min_order_amount
          ? Number(promo.min_order_amount)
          : null,
        startDate: promo.start_date,
        endDate: promo.end_date,
        createdAt: promo.created_at,
        updatedAt: promo.updated_at,
      };
    });
  }

  async getPromoById(promoId: string): Promise<GetPromoResponseDto> {
    this.logger.debug('Fetching promo by ID', { promoId });

    const promo = await this.prismaService.promo.findUnique({
      where: { id: promoId },
    });

    if (!promo) {
      this.logger.error(`Promo with ID ${promoId} not found`);
      throw new HttpException('Promo not found', 404);
    }

    return {
      id: promo.id,
      code: promo.code,
      description: promo.description,
      discountType: promo.discount_type,
      discountValue: Number(promo.discount_value),
      maxDiscount: promo.max_discount
        ? Number(promo.max_discount)
        : promo.max_discount,
      minOrderAmount: promo.min_order_amount
        ? Number(promo.min_order_amount)
        : null,
      startDate: promo.start_date,
      endDate: promo.end_date,
      createdAt: promo.created_at,
      updatedAt: promo.updated_at,
    };
  }

  async updatePromoById(
    promoId: string,
    request: UpdatePromoRequestDto,
  ): Promise<UpdatePromoResponseDto> {
    this.logger.debug('Updating promo by ID', { promoId, request });
    const updateRequest = this.validationService.validate(
      PromoValidation.UPDATE_PROMO,
      request,
    );

    const promo = await this.prismaService.promo.findUnique({
      where: { id: promoId },
    });

    if (!promo) {
      this.logger.error(`Promo with ID ${promoId} not found`);
      throw new HttpException('Promo not found', 404);
    }

    const data: Partial<Promo> = {};
    if (updateRequest.description) {
      data.description = updateRequest.description;
    }

    if (updateRequest.discountType) {
      data.discount_type = updateRequest.discountType;
    }

    if (updateRequest.discountValue) {
      data.discount_value = updateRequest.discountValue;
    }

    if (updateRequest.maxDiscount) {
      data.max_discount = updateRequest.maxDiscount;
    }

    if (updateRequest.minOrderAmount) {
      data.min_order_amount = updateRequest.minOrderAmount;
    }

    if (updateRequest.startDate) {
      data.start_date = updateRequest.startDate;
    }

    if (updateRequest.endDate) {
      data.end_date = updateRequest.endDate;
    }

    const result = await this.prismaService.promo.update({
      where: { id: promoId },
      data,
    });

    return {
      id: result.id,
      code: result.code,
      description: result.description,
      discountType: result.discount_type,
      discountValue: Number(result.discount_value),
      maxDiscount: result.max_discount
        ? Number(result.max_discount)
        : result.max_discount,
      minOrderAmount: result.min_order_amount
        ? Number(result.min_order_amount)
        : null,
      startDate: result.start_date,
      endDate: result.end_date,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    };
  }

  async deletePromoById(promoId: string): Promise<boolean> {
    this.logger.debug('Deleting promo by ID', { promoId });

    const promo = await this.prismaService.promo.count({
      where: { id: promoId },
    });
    if (promo == 0) {
      this.logger.error(`Promo with ID ${promoId} not found`);
      throw new HttpException('Promo not found', 404);
    }

    await this.prismaService.promo.delete({
      where: { id: promoId },
    });

    return true;
  }

  async validatePromo(code: string, subTotal: Decimal): Promise<Decimal> {
    this.logger.debug('Validating promo code', { code, subTotal });

    const promo = await this.prismaService.promo.findUnique({
      where: { code },
    });

    if (!promo) {
      this.logger.error(`Promo with code '${code}' not found`);
      throw new HttpException('Promo not found', 404);
    }

    const now = new Date();
    if (promo.start_date > now || promo.end_date < now) {
      throw new HttpException('Promo code is not valid', 400);
    }

    if (promo.min_order_amount && subTotal < promo.min_order_amount) {
      throw new HttpException(
        `Minimum order amount is ${String(promo.min_order_amount)}`,
        400,
      );
    }

    let discount = new Decimal(0);
    if (promo.discount_type == 'PERCENTAGE') {
      discount = subTotal.mul(promo.discount_value.div(100));

      if (promo.max_discount && discount > promo.max_discount) {
        discount = promo.max_discount;
      }
    } else if (promo.discount_type == 'FLAT') {
      discount = promo.discount_value;
    }

    return discount;
  }
}
