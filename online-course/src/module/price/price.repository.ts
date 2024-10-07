import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Price } from 'src/entities/price.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PriceRepository extends Repository<Price> {
  constructor(
    @InjectRepository(Price)
    private readonly priceRepository: Repository<Price>,
    private dataSource: DataSource,
  ) {
    super(Price, dataSource.createEntityManager());
  }

  async createPrice(priceData: Price): Promise<Price> {
    try {
      const price = this.create(priceData);
      const priceCreated = await this.save(price);

      return priceCreated;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Tier already exists');
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async getPriceById(priceId: number): Promise<Price> {
    const price = await this.findOne({
      where: { id: priceId },
    });
    return price;
  }

  async getPriceByTier(tier: string): Promise<Price> {
    const price = await this.findOne({
      where: { tier },
    });
    return price;
  }
}
