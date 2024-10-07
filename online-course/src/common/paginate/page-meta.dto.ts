import { PageMetaDtoParameters } from 'src/interface/pagination.interface';

export class PageMetaDto {
  readonly page: number;

  readonly pageSize: number;

  readonly totalCounts: number;

  readonly totalPages: number;

  readonly hasPreviousPage: boolean;

  readonly hasNextPage: boolean;

  constructor({ pageOptionsDto, totalCounts }: PageMetaDtoParameters) {
    this.page = +pageOptionsDto.page;
    this.pageSize = +pageOptionsDto.pageSize;
    this.totalCounts = totalCounts;
    this.totalPages = Math.ceil(totalCounts / pageOptionsDto.pageSize);
    this.hasPreviousPage = pageOptionsDto.page > 1;
    this.hasNextPage = pageOptionsDto.page < this.totalPages;
  }
}
