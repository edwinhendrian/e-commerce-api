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
import {
  GetAllProductResponseDto,
  GetProductResponseDto,
} from './dto/get-product.dto';
import { Product } from '@prisma/client';
import {
  UpdateProductImagesResponseDto,
  UpdateProductRequestDto,
  UpdateProductResponseDto,
} from './dto/update-product.dto';
import { UploadService } from 'src/common/upload.service';
import { Decimal } from '@prisma/client/runtime/library';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class ProductService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private validationService: ValidationService,
    private prismaService: PrismaService,
    private uploadService: UploadService,
  ) {}

  async createProduct(
    request: CreateProductRequestDto,
  ): Promise<CreateProductResponseDto> {
    this.logger.debug('Creating product', { request });
    const createRequest: CreateProductRequestDto =
      this.validationService.validate(
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

  async getAllProducts(): Promise<GetAllProductResponseDto[]> {
    this.logger.debug('Fetching all products');

    const cachedProductData: GetAllProductResponseDto[] | null =
      await this.cacheManager.get('getAllProducts');
    if (cachedProductData) return cachedProductData;

    const products = await this.prismaService.product.findMany({
      where: { is_deleted: false },
      include: {
        images: {
          select: {
            image_url: true,
          },
        },
      },
    });

    const productData = products.map((product) => {
      return {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        images: product.images.map(
          (image) => (image as { image_url: string }).image_url,
        ),
        createdAt: product.created_at,
      };
    });

    await this.cacheManager.set('getAllProducts', productData, 60 * 60);

    return productData;
  }

  async getProductById(productId: string): Promise<GetProductResponseDto> {
    this.logger.debug('Fetching product by ID', { productId });

    const cachedProductData: GetProductResponseDto | null =
      await this.cacheManager.get(`getProduct-${productId}`);
    if (cachedProductData) return cachedProductData;

    const product = await this.prismaService.product.findUnique({
      where: { id: productId, is_deleted: false },
      include: {
        category: {
          select: {
            name: true,
          },
        },
        images: {
          select: {
            image_url: true,
          },
        },
      },
    });

    if (!product) {
      this.logger.error(`Product with ID ${productId} not found`);
      throw new HttpException('Product not found', 404);
    }

    const productData = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      stock: product.stock,
      category: product.category.name,
      images: product.images.map(
        (image) => (image as { image_url: string }).image_url,
      ),
      createdAt: product.created_at,
      updatedAt: product.updated_at,
    };

    await this.cacheManager.set('getAllProducts', productData, 60 * 60);

    return productData;
  }

  async updateProductById(
    productId: string,
    request: UpdateProductRequestDto,
  ): Promise<UpdateProductResponseDto> {
    this.logger.debug('Updating product by ID', { productId, request });
    const updateRequest: UpdateProductRequestDto =
      this.validationService.validate(
        ProductValidation.UPDATE_PRODUCT,
        request,
      );

    const productCount = await this.prismaService.product.count({
      where: { id: productId },
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
      data.price = Decimal(updateRequest.price);
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
      include: {
        category: {
          select: {
            name: true,
          },
        },
        images: {
          select: {
            image_url: true,
          },
        },
      },
    });

    return {
      id: result.id,
      name: result.name,
      description: result.description,
      price: Number(result.price),
      stock: result.stock,
      categoryId: result.category_id,
      category: result.category.name,
      images: result.images.map(
        (image) => (image as { image_url: string }).image_url,
      ),
      createdAt: result.created_at,
      updatedAt: result.updated_at,
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

    return { imageUrls: productImages.map((image) => image?.image_url) };
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
