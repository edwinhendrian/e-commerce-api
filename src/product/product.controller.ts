import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { WebResponse } from 'src/common/web-response';
import {
  CreateProductRequestDto,
  CreateProductResponseDto,
} from './dto/create-product.dto';
import {
  GetAllProductResponseDto,
  GetProductResponseDto,
} from './dto/get-product.dto';
import { Public } from 'src/common/decorators/public.decorator';
import {
  UpdateProductImagesDto,
  UpdateProductImagesResponseDto,
  UpdateProductRequestDto,
  UpdateProductResponseDto,
} from './dto/update-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/multer.config';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('/api/products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('/')
  @HttpCode(201)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiResponse({ status: 201, type: CreateProductResponseDto })
  async createProduct(
    @Body() request: CreateProductRequestDto,
  ): Promise<WebResponse<CreateProductResponseDto>> {
    const result = await this.productService.createProduct(request);
    return { data: result };
  }

  @Public()
  @Get('/')
  @HttpCode(200)
  @ApiResponse({ status: 200, type: GetAllProductResponseDto, isArray: true })
  async getAll(): Promise<WebResponse<GetAllProductResponseDto[]>> {
    const result = await this.productService.getAllProducts();
    return { data: result };
  }

  @Public()
  @Get('/:id')
  @HttpCode(200)
  @ApiResponse({ status: 200, type: GetProductResponseDto })
  async getProduct(
    @Param('id') id: string,
  ): Promise<WebResponse<GetProductResponseDto>> {
    const result = await this.productService.getProductById(id);
    return { data: result };
  }

  @Patch('/:id')
  @HttpCode(200)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: UpdateProductResponseDto })
  async updateProduct(
    @Param('id') id: string,
    @Body() request: UpdateProductRequestDto,
  ): Promise<WebResponse<UpdateProductResponseDto>> {
    const result = await this.productService.updateProductById(id, request);
    return { data: result };
  }

  @Put('/:id/images')
  @HttpCode(200)
  @UseInterceptors(FilesInterceptor('files', 5, multerOptions))
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateProductImagesDto })
  @ApiResponse({ status: 200, type: UpdateProductImagesResponseDto })
  async updateProductImages(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<WebResponse<UpdateProductImagesResponseDto>> {
    const result = await this.productService.updateProductImages(id, files);
    return { data: result };
  }

  @Delete('/:id')
  @HttpCode(204)
  @Roles('ADMIN')
  @ApiBearerAuth()
  async deleteProduct(@Param('id') id: string): Promise<WebResponse<boolean>> {
    const result = await this.productService.deleteProductById(id);
    return { data: result };
  }
}
