import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { PageCommonOptionDto } from 'src/common/paginate/page-option.dto';

export class GetUsersDto extends PageCommonOptionDto {
  @IsOptional()
  @Transform(({ value }) => value.split(','))
  roles: string[];
}
