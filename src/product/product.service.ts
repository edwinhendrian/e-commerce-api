import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { Logger } from 'winston';
import {
  CreateProductRequestDto,
  CreateProductResponseDto,
} from './dto/create-product.dto';
import { ProductValidation } from './product.validation';
import { GetProductResponseDto } from './dto/get-product.dto';
import { Product } from '@prisma/client';
import {
  UpdateProductImagesResponseDto,
  UpdateProductRequestDto,
  UpdateProductResponseDto,
} from './dto/update-product.dto';
import { UploadService } from 'src/common/upload.service';

@Injectable()
export class ProductService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private validationService: ValidationService,
    private prismaService: PrismaService,
    private uploadService: UploadService,
  ) {}

  async createProduct(
    request: CreateProductRequestDto,
  ): Promise<CreateProductResponseDto> {
    this.logger.debug('Creating product', { request });
    const createRequest = this.validationService.validate(
      ProductValidation.CREATE_PRODUCT,
      request,
    );

    const product = await this.prismaService.product.create({
      data: {
        name: createRequest.name,
        description: createRequest.description
          ? createRequest.description
          : null,
        price: createRequest.price,
        stock: createRequest.stock,
        category_id: createRequest.categoryId,
      },
    });

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      stock: product.stock,
      categoryId: product.category_id,
    };
  }

  async getAllProducts(): Promise<GetProductResponseDto[]> {
    this.logger.debug('Fetching all products');

    const products: Product[] = await this.prismaService.product.findMany({
      where: { is_deleted: false },
    });

    return products.map((product) => {
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: Number(product.price),
        stock: product.stock,
        categoryId: product.category_id,
        createdAt: product.created_at,
        updatedAt: product.updated_at,
      };
    });
  }

  async getProductById(productId: string): Promise<GetProductResponseDto> {
    this.logger.debug('Fetching product by ID', { productId });

    const product = await this.prismaService.product.findUnique({
      where: { id: productId, is_deleted: false },
    });

    if (!product) {
      this.logger.error(`Product with ID ${productId} not found`);
      throw new HttpException('Product not found', 404);
    }

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      stock: product.stock,
      categoryId: product.category_id,
      createdAt: product.created_at,
      updatedAt: product.updated_at,
    };
  }

  async updateProductById(
    productId: string,
    request: UpdateProductRequestDto,
  ): Promise<UpdateProductResponseDto> {
    this.logger.debug('Updating product by ID', { productId, request });
    const updateRequest = this.validationService.validate(
      ProductValidation.UPDATE_PRODUCT,
      request,
    );

    const productCount = await this.prismaService.product.count({
      where: { name: updateRequest.name },
    });
    if (productCount == 0) {
      this.logger.error(`Product with ID ${productId} not found`);
      throw new HttpException('Product not found', 404);
    }

    const data: Partial<Product> = {};
    if (updateRequest.description) {
      data.description = updateRequest.description;
    }

    if (updateRequest.price) {
      data.price = updateRequest.price;
    }

    if (updateRequest.stock) {
      data.stock = updateRequest.stock;
    }

    if (updateRequest.categoryId) {
      data.category_id = updateRequest.categoryId;
    }

    const result = await this.prismaService.product.update({
      where: { id: productId },
      data,
    });

    return {
      id: result.id,
      name: result.name,
      description: result.description,
      price: Number(result.price),
      stock: result.stock,
      categoryId: result.category_id,
    };
  }

  async updateProductImages(
    productId: string,
    files: Express.Multer.File[],
  ): Promise<UpdateProductImagesResponseDto> {
    this.logger.debug(`Updating product's images`, { productId, files });

    const productCount = await this.prismaService.product.count({
      where: { id: productId },
    });
    if (productCount == 0) {
      this.logger.error(`Product with ID ${productId} not found`);
      throw new HttpException('Product not found', 404);
    }

    //TODO: update images partial (max 5 images in total)
    //TODO: delete old images

    const image_urls = await this.uploadService.uploadImages(files);
    if (!image_urls) {
      throw new HttpException('Failed to upload images', 500);
    }

    //TODO: if 1 image fails to upload, remove all images
    const productImages = await Promise.all(
      image_urls.map((url) => {
        if (url) {
          return this.prismaService.productImage.create({
            data: {
              product_id: productId,
              image_url: url,
            },
          });
        }
      }),
    );

    return { image_urls: productImages.map((image) => image?.image_url) };
  }

  async deleteProductById(productId: string): Promise<boolean> {
    this.logger.debug('Deleting product by ID', { productId });

    const productCount = await this.prismaService.product.count({
      where: { id: productId },
    });
    if (productCount == 0) {
      this.logger.error(`Product with ID ${productId} not found`);
      throw new HttpException('Product not found', 404);
    }

    await this.prismaService.product.update({
      where: { id: productId },
      data: { is_deleted: true },
    });

    return true;
  }
}
