import { PageCommonOptionDto } from 'src/common/paginate/page-option.dto';

export interface Pagination {
  take: number;
  skip: number;
}

export interface PageMetaDtoParameters {
  pageOptionsDto: PageCommonOptionDto;
  totalCounts: number;
}
