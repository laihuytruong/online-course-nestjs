import { Transform } from 'class-transformer';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateMessageDto {
  @Transform(({ value }) => +value)
  to: number;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  text: string;
}
