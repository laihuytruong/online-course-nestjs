import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
  Put,
} from '@nestjs/common';
import { PriceService } from './price.service';
import { CreatePriceDto } from './dto/create-price.dto';
import { UpdatePriceDto } from './dto/update-price.dto';
import { AdminRoleGuard } from 'src/guards/admin-role.guard';
import { ResponseData } from 'src/interface/response.interface';
import { Public } from 'src/decorators/public.decorator';
import { PageCommonOptionDto } from 'src/common/paginate/page-option.dto';

@Controller('prices')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Post()
  @UseGuards(AdminRoleGuard)
  @HttpCode(HttpStatus.CREATED)
  createPrice(@Body() createPriceDto: CreatePriceDto): Promise<ResponseData> {
    return this.priceService.createPrice(createPriceDto);
  }

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  getPrices(
    @Query() pageCommonOptionDto: PageCommonOptionDto,
  ): Promise<ResponseData> {
    return this.priceService.getPrices(pageCommonOptionDto);
  }

  @Put(':id')
  @UseGuards(AdminRoleGuard)
  @HttpCode(HttpStatus.OK)
  updatePrice(
    @Param('id') priceId: number,
    @Body() updatePriceDto: UpdatePriceDto,
  ): Promise<ResponseData> {
    return this.priceService.updatePrice(priceId, updatePriceDto);
  }

  @Delete(':id')
  @UseGuards(AdminRoleGuard)
  @HttpCode(HttpStatus.OK)
  deletePrice(@Param('id') priceId: number): Promise<ResponseData> {
    return this.priceService.deletePrice(priceId);
  }
}
