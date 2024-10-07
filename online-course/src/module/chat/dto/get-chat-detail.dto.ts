import { Transform } from 'class-transformer';
import { PageCommonOptionDto } from 'src/common/paginate/page-option.dto';

export class GetChatDetailDto extends PageCommonOptionDto {
  @Transform(({ value }) => +value)
  to: number;
}
