import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import {
  CreateCategoryRequestDto,
  CreateCategoryResponseDto,
} from './dto/create-category.dto';
import {
  UpdateCategoryRequestDto,
  UpdateCategoryResponseDto,
} from './dto/update-category.dto';
import { WebResponse } from 'src/common/web-response';
import { GetCategoryResponseDto } from './dto/get-category.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@Controller('/api/categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post('/')
  @HttpCode(201)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiResponse({ status: 201, type: CreateCategoryResponseDto })
  async createCategory(
    @Body() request: CreateCategoryRequestDto,
  ): Promise<WebResponse<CreateCategoryResponseDto>> {
    const result = await this.categoryService.createCategory(request);
    return { data: result };
  }

  @Public()
  @Get('/')
  @HttpCode(200)
  @ApiResponse({ status: 200, type: GetCategoryResponseDto, isArray: true })
  async getAll(): Promise<WebResponse<GetCategoryResponseDto[]>> {
    const result = await this.categoryService.getAllCategories();
    return { data: result };
  }

  @Public()
  @Get('/:id')
  @HttpCode(200)
  @ApiResponse({ status: 200, type: GetCategoryResponseDto })
  async getCategory(
    @Param('id') id: string,
  ): Promise<WebResponse<GetCategoryResponseDto>> {
    const result = await this.categoryService.getCategoryById(id);
    return { data: result };
  }

  @Put('/:id')
  @HttpCode(200)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: UpdateCategoryResponseDto })
  async updateCategory(
    @Param('id') id: string,
    @Body() request: UpdateCategoryRequestDto,
  ): Promise<WebResponse<UpdateCategoryResponseDto>> {
    const result = await this.categoryService.updateCategoryById(id, request);
    return { data: result };
  }

  @Delete('/:id')
  @HttpCode(204)
  @ApiBearerAuth()
  @Roles('ADMIN')
  async deleteCategory(@Param('id') id: string): Promise<WebResponse<boolean>> {
    const result = await this.categoryService.deleteCategoryById(id);
    return { data: result };
  }
}
