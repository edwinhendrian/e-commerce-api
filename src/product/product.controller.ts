import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { WebResponse } from 'src/common/web-response';
import {
  CreateProductRequestDto,
  CreateProductResponseDto,
} from './dto/create-product.dto';
import { GetProductResponseDto } from './dto/get-product.dto';
import { Public } from 'src/common/decorators/public.decorator';
import {
  UpdateProductRequestDto,
  UpdateProductResponseDto,
} from './dto/update-product.dto';

@Controller('/api/products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('/')
  @HttpCode(201)
  @Roles(['ADMIN'])
  async createCategory(
    @Body() request: CreateProductRequestDto,
  ): Promise<WebResponse<CreateProductResponseDto>> {
    const result = await this.productService.createProduct(request);
    return { data: result };
  }

  @Public()
  @Get('/')
  @HttpCode(200)
  async getAll(): Promise<WebResponse<GetProductResponseDto[]>> {
    const result = await this.productService.getAllProducts();
    return { data: result };
  }

  @Public()
  @Get('/:id')
  @HttpCode(200)
  async getProduct(
    @Param('id') id: string,
  ): Promise<WebResponse<GetProductResponseDto>> {
    const result = await this.productService.getProductById(id);
    return { data: result };
  }

  @Patch('/:id')
  @HttpCode(200)
  @Roles(['ADMIN'])
  async updateProduct(
    @Param('id') id: string,
    @Body() request: UpdateProductRequestDto,
  ): Promise<WebResponse<UpdateProductResponseDto>> {
    const result = await this.productService.updateProductById(id, request);
    return { data: result };
  }

  @Delete('/:id')
  @HttpCode(204)
  @Roles(['ADMIN'])
  async deleteProduct(@Param('id') id: string): Promise<WebResponse<boolean>> {
    const result = await this.productService.deleteProductById(id);
    return { data: result };
  }
}
