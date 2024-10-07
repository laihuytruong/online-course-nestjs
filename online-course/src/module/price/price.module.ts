import { Module } from '@nestjs/common';
import { PriceService } from './price.service';
import { PriceController } from './price.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Price } from 'src/entities/price.entity';
import { PriceRepository } from './price.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Price]), UserModule],
  controllers: [PriceController],
  providers: [PriceService, PriceRepository],
})
export class PriceModule {}
