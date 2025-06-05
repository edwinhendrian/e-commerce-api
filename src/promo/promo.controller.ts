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
import { PromoService } from './promo.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { WebResponse } from 'src/common/web-response';
import {
  CreatePromoRequestDto,
  CreatePromoResponseDto,
} from './dto/create-promo.dto';
import { GetPromoResponseDto } from './dto/get-promo.dto';
import {
  UpdatePromoRequestDto,
  UpdatePromoResponseDto,
} from './dto/update-promo.dto';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@Controller('/api/promos')
export class PromoController {
  constructor(private promoService: PromoService) {}

  @Post('/')
  @HttpCode(201)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiResponse({ status: 201, type: CreatePromoResponseDto })
  async createPromo(
    @Body() request: CreatePromoRequestDto,
  ): Promise<WebResponse<CreatePromoResponseDto>> {
    const result = await this.promoService.createPromo(request);
    return { data: result };
  }

  @Get('/')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: GetPromoResponseDto, isArray: true })
  async getAll(): Promise<WebResponse<GetPromoResponseDto[]>> {
    const result = await this.promoService.getAllPromos();
    return { data: result };
  }

  @Get('/:id')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: GetPromoResponseDto })
  async getPromo(
    @Param('id') id: string,
  ): Promise<WebResponse<GetPromoResponseDto>> {
    const result = await this.promoService.getPromoById(id);
    return { data: result };
  }

  @Patch('/:id')
  @HttpCode(200)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: UpdatePromoResponseDto })
  async updatePromo(
    @Param('id') id: string,
    @Body() request: UpdatePromoRequestDto,
  ): Promise<WebResponse<UpdatePromoResponseDto>> {
    const result = await this.promoService.updatePromoById(id, request);
    return { data: result };
  }

  @Delete('/:id')
  @HttpCode(204)
  @Roles('ADMIN')
  @ApiBearerAuth()
  async deletePromo(@Param('id') id: string): Promise<WebResponse<boolean>> {
    const result = await this.promoService.deletePromoById(id);
    return { data: result };
  }
}
