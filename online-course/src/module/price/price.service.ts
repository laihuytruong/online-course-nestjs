import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePriceDto } from './dto/create-price.dto';
import { UpdatePriceDto } from './dto/update-price.dto';
import { ResponseData } from 'src/interface/response.interface';
import { Price } from 'src/entities/price.entity';
import { PriceRepository } from './price.repository';
import { PageCommonOptionDto } from 'src/common/paginate/page-option.dto';
import { PageMetaDto } from 'src/common/paginate/page-meta.dto';
import { PageDto } from 'src/common/paginate/paginate.dto';

@Injectable()
export class PriceService {
  constructor(private priceRepository: PriceRepository) {}

  async createPrice(createPriceDto: CreatePriceDto): Promise<ResponseData> {
    const { tier, value } = createPriceDto;
    const price: Price = {
      tier,
      value,
    };

    const priceCreate = await this.priceRepository.createPrice(price);

    const responseData: ResponseData = {
      message: 'Create price successfully',
      data: priceCreate,
    };
    return responseData;
  }

  async getPrices(
    pageCommonOptionDto: PageCommonOptionDto,
  ): Promise<ResponseData> {
    const queryBuilder = this.priceRepository.createQueryBuilder('price');
    queryBuilder.orderBy('price.created_at', pageCommonOptionDto.order);

    queryBuilder
      .skip(pageCommonOptionDto.skip)
      .take(pageCommonOptionDto.pageSize);

    const totalCounts = await queryBuilder.getCount();

    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({
      totalCounts,
      pageOptionsDto: pageCommonOptionDto,
    });

    const data = new PageDto(entities, pageMetaDto);

    const responseData: ResponseData = {
      message: 'Get prices successfully!',
      data,
    };

    return responseData;
  }

  async updatePrice(
    priceId: number,
    updatePriceDto: UpdatePriceDto,
  ): Promise<ResponseData> {
    const { tier, value } = updatePriceDto;
    const price = await this.priceRepository.getPriceById(priceId);

    if (!price) {
      throw new NotFoundException('Price not found');
    }

    if (tier) {
      const priceTier = await this.priceRepository.getPriceByTier(tier);

      if (priceTier && priceTier.id !== priceId) {
        throw new ConflictException('Tier already exists');
      }
      price.tier = tier;
    }

    if (value) {
      price.value = value;
    }

    await this.priceRepository.save(price);
    const responseData: ResponseData = {
      message: 'Update price successfully!',
      data: price,
    };

    return responseData;
  }

  async deletePrice(priceId: number): Promise<ResponseData> {
    const price = await this.priceRepository.getPriceById(priceId);

    if (!price) {
      throw new NotFoundException('Price not found');
    }

    await this.priceRepository.delete(priceId);

    const responseData: ResponseData = {
      message: 'Delete price successfully!',
    };

    return responseData;
  }
}
