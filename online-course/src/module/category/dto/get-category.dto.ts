import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { PageCommonOptionDto } from 'src/common/paginate/page-option.dto';

export class GetCategoryDto extends PageCommonOptionDto {
  @IsOptional()
  @Transform(({ value }) => +value)
  @IsNumber()
  parentId?: number;
}
