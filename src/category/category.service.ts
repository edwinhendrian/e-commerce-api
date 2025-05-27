import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { Logger } from 'winston';
import { CategoryValidation } from './category.validation';
import { Category } from '@prisma/client';
import {
  CreateCategoryRequestDto,
  CreateCategoryResponseDto,
} from './dto/create-category.dto';
import { GetCategoryResponseDto } from './dto/get-category.dto';
import {
  UpdateCategoryRequestDto,
  UpdateCategoryResponseDto,
} from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private validationService: ValidationService,
    private prismaService: PrismaService,
  ) {}

  async createCategory(
    request: CreateCategoryRequestDto,
  ): Promise<CreateCategoryResponseDto> {
    this.logger.debug('Creating category', { request });
    const createRequest: CreateCategoryRequestDto =
      this.validationService.validate(CategoryValidation.CATEGORY, request);

    const categoryCount = await this.prismaService.category.count({
      where: { name: createRequest.name },
    });
    if (categoryCount != 0) {
      this.logger.error(
        `Category with name ${createRequest.name} already exists`,
      );
      throw new HttpException('Category already exists', 409);
    }

    const category = await this.prismaService.category.create({
      data: { name: createRequest.name },
    });

    return {
      id: category.id,
      name: category.name,
      createdAt: category.created_at,
      updatedAt: category.updated_at,
    };
  }

  async getAllCategories(): Promise<GetCategoryResponseDto[]> {
    this.logger.debug('Fetching all categories');

    const categories: Category[] = await this.prismaService.category.findMany();

    return categories.map((category) => {
      return {
        id: category.id,
        name: category.name,
        createdAt: category.created_at,
        updatedAt: category.updated_at,
      };
    });
  }

  async getCategoryById(categoryId: string): Promise<GetCategoryResponseDto> {
    this.logger.debug('Fetching category by ID', { categoryId });

    const category = await this.prismaService.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      this.logger.error(`Category with ID ${categoryId} not found`);
      throw new HttpException('Category not found', 404);
    }

    return {
      id: category.id,
      name: category.name,
      createdAt: category.created_at,
      updatedAt: category.updated_at,
    };
  }

  async updateCategoryById(
    categoryId: string,
    request: UpdateCategoryRequestDto,
  ): Promise<UpdateCategoryResponseDto> {
    this.logger.debug('Updating category by ID', { categoryId, request });
    const updateRequest: UpdateCategoryRequestDto =
      this.validationService.validate(CategoryValidation.CATEGORY, request);

    const categoryCount = await this.prismaService.category.count({
      where: { name: updateRequest.name },
    });
    if (categoryCount != 0) {
      this.logger.error(
        `Category with name ${updateRequest.name} already exists`,
      );
      throw new HttpException('Category already exists', 409);
    }

    const result = await this.prismaService.category.update({
      where: { id: categoryId },
      data: { name: updateRequest.name },
    });

    return {
      id: result.id,
      name: result.name,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    };
  }

  async deleteCategoryById(categoryId: string): Promise<boolean> {
    this.logger.debug('Deleting category by ID', { categoryId });

    const categoryCount = await this.prismaService.category.count({
      where: { id: categoryId },
    });
    if (categoryCount == 0) {
      this.logger.error(`Category with ID ${categoryId} not found`);
      throw new HttpException('Category not found', 404);
    }

    await this.prismaService.category.delete({
      where: { id: categoryId },
    });

    return true;
  }
}
