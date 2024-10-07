import { Transform } from 'class-transformer';
import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePriceDto {
  @IsString()
  @MinLength(1)
  @MaxLength(32)
  tier: string;

  @Transform(({ value }) => +value)
  @IsNumber()
  value: number;
}
